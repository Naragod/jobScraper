import { server } from "./apiRequests/server";

const main = () => {
  const port = 8890;

  server.listen(port, () => {
    console.log("Listening on port:", port);
  });
};

try {
  main();

  // await closeBrowser();
} catch (err) {
  console.error(err);
  main();
}
