/*EndCapcha HTTP.

To access the HTTP API, use
HttpClient class.  Both are thread-safe.

HttpClient give you the following methods:

get_balance()
    Returns your EC account balance in US cents.

get_captcha(cid)
    Returns an uploaded CAPTCHA details as a dict with the following keys:

    "captcha": the CAPTCHA numeric ID; if no such CAPTCHAs found, it will
        be the only item with the value of 0;
    "text": the CAPTCHA text, if solved, otherwise None.

    The only argument `cid` is the CAPTCHA numeric ID.

get_text(cid)
    Returns an uploaded CAPTCHA text (null if not solved).  The only argument
    `cid` is the CAPTCHA numeric ID.

report(cid)
    Reports an incorrectly solved CAPTCHA.  The only argument `cid` is the
    CAPTCHA numeric ID.  Returns True on success, False otherwise.

upload(captcha)
    Uploads a CAPTCHA.  The only argument `captcha` can be either file-like
    object (any object with `read` method defined, actually, so StringIO
    will do), or CAPTCHA image file name.  On successul upload you'll get
    the CAPTCHA details dict (see get_captcha() method).

    NOTE: AT THIS POINT THE UPLOADED CAPTCHA IS NOT SOLVED YET!  You have
    to poll for its status periodically using get_captcha() or get_text()
    method until the CAPTCHA is solved and you get the text.

decode(captcha, timeout=DEFAULT_TIMEOUT)
    A convenient method that uploads a CAPTCHA and polls for its status
    periodically, but no longer than `timeout` (defaults to 60 seconds).
    If solved, you'll get the CAPTCHA details dict (see get_captcha()
    method for details).  See upload() method for details on `captcha`
    argument.

Visit http://www.endcaptcha.com for updates.*/

const request = require("request");
const querystring = require("querystring");
const fs = require("fs");
const crypto = require("crypto");
const EventEmitter = require("events");

const HTTP_BASE_URL = "http://api.endcaptcha.com";

// Default CAPTCHA timeout and decode() polling interval
const DEFAULT_TIMEOUT = 60;
const DEFAULT_TOKEN_TIMEOUT = 120;
const POLLS_INTERVAL = [1, 1, 2, 3, 2, 2, 3, 2, 2];
const DFLT_POLL_INTERVAL = 3;

function _match_respose(response, cmd) {
  let re = /^(ERROR):(.+)$|^(UNSOLVED_YET):(.+)$/;
  let reMatch = re.exec(response);
  let match = {};

  if (reMatch) {
    if (reMatch[1]) {
      match[reMatch[1].toLowerCase()] = reMatch[2].toLowerCase();
    } else {
      match[reMatch[3].toLowerCase()] = reMatch[4].toLowerCase().substr(6);
    }
    return match;
  } else {
    if (cmd === "balance") {
      match[cmd] = response;
      return match;
    }

    if (cmd.substr(0, 6) === "/poll/" || cmd === "upload") {
      match["text"] = response;
      return match;
    } else {
      match[cmd] = response;
      return match;
    }
  }
}

function _load_image(captcha) {
  if (typeof captcha === "object" && captcha instanceof fs.ReadStream) {
    return captcha;
  }

  if (fs.existsSync(captcha)) {
    return fs.createReadStream(captcha);
  } else {
    throw "CAPTCHA image is empty";
  }
}

function _call(cmd, payload) {
  const clientEvent = new HttpClientEventEmitter();

  if (payload) {
    payload = Object.assign(payload, this.userpwd);
    request.post(
      {
        url: `${HTTP_BASE_URL}/${cmd}`,
        formData: payload,
      },
      function (err, httpResponse, body) {
        clientEvent.emit("response", _match_respose.call(this, body, cmd));
      },
    );
  } else {
    request.get(
      {
        url: HTTP_BASE_URL + "/" + cmd,
      },
      function (err, httpResponse, body) {
        clientEvent.emit("response", _match_respose.call(this, body, cmd));
      },
    );
  }

  return clientEvent;
}

function _captcha_type(captcha) {
  if (typeof captcha === "object" && captcha.type) {
    return captcha.type;
  } else {
    return 0;
  }
}

class HttpClientEventEmitter extends EventEmitter {}

class HttpClient {
  constructor(username, password) {
    this.userpwd = {
      username: username,
      password: password,
    };
  }

  get_balance() {
    let payload = {};
    return _call.call(this, "balance", payload);
  }

  upload(captcha) {
    let payload = {};

    if (_captcha_type(captcha) in [4, 5]) {
      payload.type = _captcha_type(captcha);
      payload.token_params = JSON.stringify(captcha);
    } else if (_captcha_type(captcha) == 7) {
      payload.type = _captcha_type(captcha);
      payload.hcaptcha_params = JSON.stringify(captcha);
    } else if (_captcha_type(captcha) == 6) {
      payload.type = _captcha_type(captcha);
      payload.funcaptcha_params = JSON.stringify(captcha);
    } else {
      payload.image = _load_image(captcha);
    }

    return _call.call(this, "upload", payload);
  }

  get_captcha(cid) {
    return _call.call(this, `/poll/${cid}`);
  }

  decode(captcha, timeout) {
    const clientEvent = new HttpClientEventEmitter();
    let intvl_idx = 0;

    if (!timeout) {
      if (_captcha_type(captcha) >= 4) {
        timeout = DEFAULT_TOKEN_TIMEOUT;
      } else {
        timeout = DEFAULT_TIMEOUT;
      }
    }

    let uploaded_captcha = this.upload(captcha);
    let deadline = Date.now() + timeout * 1000;

    uploaded_captcha.on("response", (res) => {
      if (res.text) {
        clientEvent.emit("response", res);
      } else if (res.unsolved_yet) {
        get_captcha_from_interval.call(this, 0, clientEvent, res.unsolved_yet);
      } else if (res.error) {
        clientEvent.emit("response", res);
      }
    });

    return clientEvent;

    function get_captcha_from_interval(intvl, clientEvent, cid) {
      let self = this;

      setTimeout(() => {
        if (deadline > Date.now()) {
          let interval = _get_poll_interval(intvl_idx);
          intvl_idx = interval[1];
          intvl = interval[0];

          self.get_captcha(cid).on("response", (res2) => {
            if (res2.text) {
              if (cid) {
                res2.captcha_id = cid;
              }
              clientEvent.emit("response", res2);
            } else if (res2.unsolved_yet) {
              get_captcha_from_interval.call(self, intvl, clientEvent, cid);
            }
          });
        } else {
          clientEvent.emit("response", {
            unsolved_yet: cid,
          });
        }
      }, intvl);
    }

    function _get_poll_interval(idx) {
      //Returns poll interval and next index depending on index provided
      let intvl = POLLS_INTERVAL > idx ? POLLS_INTERVAL[idx] : DFLT_POLL_INTERVAL;
      idx += 1;
      return [intvl * 1000, idx];
    }
  }

  report(captcha) {
    const clientEvent = new HttpClientEventEmitter();
    let payload = {};
    let re = /^[0-9a-f]{40}$/;
    let reMatch = re.exec(captcha);

    if (typeof captcha == "string" && Number(captcha)) {
      payload.captcha_id = parseInt(captcha);
      _call.call(this, "report", payload).on("response", (res) => {
        clientEvent.emit("response", res);
      });
    }
    if (typeof captcha == "number") {
      payload.captcha_id = parseInt(captcha);
      _call.call(this, "report", payload).on("response", (res) => {
        clientEvent.emit("response", res);
      });
    }
    if (typeof captcha == "string" && reMatch) {
      payload.hash = captcha;
      _call.call(this, "report", payload).on("response", (res) => {
        clientEvent.emit("response", res);
      });
    }
    if (
      (typeof captcha === "object" && captcha instanceof fs.ReadStream) ||
      (typeof captcha == "string" && fs.existsSync(captcha))
    ) {
      let image = _load_image(captcha);
      let hash = crypto.createHash("sha1");

      image
        .on("data", function (chunk) {
          hash.update(chunk);
          payload.hash = hash.digest("hex");
        })
        .on("end", () => {
          _call.call(this, "report", payload).on("response", (res) => {
            clientEvent.emit("response", res);
          });
        });
    }

    return clientEvent;
  }

  get_text(cid) {
    const clientEvent = new HttpClientEventEmitter();

    _call.call(this, `/poll/${cid}`).on("response", (res) => {
      if (res.text) {
        clientEvent.emit("response", res.text);
      } else {
        clientEvent.emit("response", null);
      }
    });

    return clientEvent;
  }
}

module.exports = HttpClient;
