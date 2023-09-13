import { defaultEmailValues } from "./email_config.json";
import { Attachment } from "nodemailer/lib/mailer";
import { TemplateType, templateTypes } from "./email_templates/template";

export interface IEmailTemplate {
  text: string;
  subject: string;
  attachments?: Attachment[];
}

export interface ITemplateValues {
  position: string;
  jobBoard: string;
}

export interface IEmailInputOptions {
  to: string;
  position: string;
  from?: string;
  jobBoard?: string;
  templateType?: TemplateType;
}

export interface IEmailOptions extends IEmailTemplate {
  to: string;
  from: string;
}

export const replaceEmailPlaceholders = (emailTemplate: IEmailTemplate, values: ITemplateValues): IEmailTemplate => {
  const { position, jobBoard } = values;
  let stringEmail = JSON.stringify(emailTemplate);

  const posRegEx = new RegExp("{position}", "gi");
  const jobRegEx = new RegExp("{jobBoard}", "gi");
  stringEmail = stringEmail.replace(posRegEx, position);
  stringEmail = stringEmail.replace(jobRegEx, jobBoard);

  return JSON.parse(stringEmail);
};

const getDefaultEmailOptions = (email: IEmailInputOptions) => {
  const { from, jobBoard, templateType } = email;
  return {
    to: email.to,
    position: email.position,
    from: from || defaultEmailValues.from,
    jobBoard: jobBoard || defaultEmailValues.jobBoard,
    templateType: templateType || defaultEmailValues.templateType,
  };
};

export const getEmailOptions = (templateValues: IEmailInputOptions): IEmailOptions => {
  const emailValues = getDefaultEmailOptions(templateValues);
  const { from, to, templateType } = emailValues;

  const template = (templateTypes as any)[templateType];
  const updatedTemplate = replaceEmailPlaceholders(template, emailValues);
  return { from, to, ...updatedTemplate };
};
