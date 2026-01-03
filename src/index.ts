import * as p from "@clack/prompts";
import { Command } from "commander";
import pkg from "../package.json" with { type: "json" };
import {
          COLORS,
          DEFAULT_LANGUAGE,
          ERROR_MESSAGES,
          getAllExcuses,
          getExcuseCount,
          getRandomExcuse,
          handleError,
          handleLanguageOption,
          isValidLanguage,
} from "./utils.js";

const program = new Command();

program
  .name("excuz")
  .description("Get random humorous developer excuses")
  .version(pkg.version, "-v, --version")
  .helpOption("-h, --help", "Show help for command");

program
  .option("-l, --lang <language>", "Language code (bn|en)", DEFAULT_LANGUAGE)
  .action((options: { lang?: string }) => {
    try {
      const lang = handleLanguageOption(options.lang);
      const excuse = getRandomExcuse(lang);
      process.stdout.write(`${COLORS.GREEN}${excuse}${COLORS.RESET}\n`);
    } catch (error) {
      handleError(error, options.lang);
    }
  });

program
  .command("list")
  .alias("l")
  .description("List all excuses")
  .option("-l, --lang <language>", "Language code (bn|en)", DEFAULT_LANGUAGE)
  .option("--limit <number>", "Limit the number of excuses to display")
  .action((options: { lang?: string; limit?: string }) => {
    try {
      const lang = handleLanguageOption(options.lang);
      let excuses = getAllExcuses(lang);

      if (options.limit) {
        const limit = parseInt(options.limit, 10);
        if (!isNaN(limit) && limit > 0) {
          excuses = excuses.slice(0, limit);
        }
      }

      excuses.forEach((excuse, index) => {
        process.stdout.write(`${index + 1}. ${excuse}\n`);
      });
    } catch (error) {
      handleError(error, options.lang);
    }
  });

program
  .command("count")
  .alias("c")
  .description("Get the number of excuses")
  .option("-l, --lang <language>", "Language code (bn|en)", DEFAULT_LANGUAGE)
  .action((options: { lang?: string }) => {
    try {
      const lang = handleLanguageOption(options.lang);
      const count = getExcuseCount(lang);
      process.stdout.write(`Number of excuses: ${count}\n`);
    } catch (error) {
      handleError(error, options.lang);
    }
  });

program
  .command("i")
  .description("Interactive mode")
  .action(async () => {
    p.intro("Welcome to Excuz - Interactive Mode 🎉");

    const action = await p.select({
      message: "What would you like to do?",
      options: [
        { value: "random", label: "Get a random excuse" },
        { value: "list", label: "List all excuses" },
        { value: "count", label: "Get count of excuses" },
      ],
    });

    if (p.isCancel(action)) {
      p.outro("Thanks for using Excuz! 🎉");
      process.exit(0);
    }

    const lang = await p.select({
      message: "Select language:",
      options: [
        { value: "en", label: "English" },
        { value: "bn", label: "Bengali (বাংলা)" },
      ],
    });

    if (p.isCancel(lang)) {
      p.outro("Thanks for using Excuz! 🎉");
      process.exit(0);
    }

    try {
      if (!isValidLanguage(lang)) {
        p.cancel(`Invalid language: ${lang}`);
        process.exit(0);
      }

      if (action === "random") {
        const excuse = getRandomExcuse(lang);
        p.outro(`${COLORS.GREEN}${excuse}${COLORS.RESET}`);
      } else if (action === "list") {
        const excuses = getAllExcuses(lang);
        const displayLimit = 50;
        const displayExcuses = excuses.slice(0, displayLimit);
        const remaining = excuses.length - displayLimit;

        p.outro(
          `\n${displayExcuses.map((e, i) => `${i + 1}. ${e}`).join("\n")}${
            remaining > 0 ? `\n\n... and ${remaining} more (use "excuz list -l ${lang}" to see all)` : ""
          }`,
        );
      } else if (action === "count") {
        const count = getExcuseCount(lang);
        p.outro(`Number of excuses: ${count}`);
      }
    } catch (error) {
      p.cancel(ERROR_MESSAGES.GENERIC_ERROR);
      process.exit(0);
    }
  });

program.exitOverride();
program.configureOutput({
  writeErr: () => {},
});

try {
  program.parse();
} catch (err: any) {
  if (err.code === 'commander.helpDisplayed') {
    process.exit(0);
  }

  if (err.code === 'commander.unknownCommand' || err.code === 'commander.excessArguments') {
    const args = process.argv.slice(2);
    if (args.length > 0 && !args[0].startsWith('-')) {
      const lang = args[0];
      if (isValidLanguage(lang)) {
        process.stdout.write(
          `${COLORS.YELLOW}💡 Tip: Use "npx excuz -l ${lang}" or "npx excuz --lang ${lang}" instead.${COLORS.RESET}\n`,
        );
        process.exit(0);
      } else {
        process.stdout.write(
          `${COLORS.YELLOW}💡 Tip: Use "npx excuz -l <language>" where language is "bn" or "en".${COLORS.RESET}\n`,
        );
        process.exit(0);
      }
    } else {
      process.exit(0);
    }
  } else {
    throw err;
  }
}
