import fs from 'fs';
import path from 'path';

const templatesDir = path.join(__dirname, "../templates");

const renderTemplate = (templateName: string, variables: Record<string, any>): string => {
  const templatePath = path.join(templatesDir, templateName);
  let template = fs.readFileSync(templatePath, 'utf8');

  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, variables[key]);
  });

  return template;
};

export { renderTemplate };
