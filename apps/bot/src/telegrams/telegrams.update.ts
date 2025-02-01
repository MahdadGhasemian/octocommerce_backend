import { TelegramsService } from './telegrams.service';
import { Command, Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context as TelegrafContext, Telegraf } from 'telegraf';
import { TELEGRAM_BOT_COMMANDS } from './commands';
import { TELEGRAM_BOT_MESSAGES } from '@app/common';

interface SessionData {
  user_id: string;
}

interface MyContext extends TelegrafContext {
  session?: SessionData;
}

@Update()
export class TelegramsUpdate {
  constructor(
    @InjectBot() private readonly telegraf: Telegraf<MyContext>,
    private readonly telegramsService: TelegramsService,
  ) {
    this.telegraf.telegram.setMyCommands(TELEGRAM_BOT_COMMANDS);
  }

  @Start()
  async startCommand(@Ctx() telegrafContext) {
    const userTelegramName: string =
      telegrafContext?.update?.message?.from?.first_name ||
      telegrafContext?.update?.message?.from?.username;

    telegrafContext.session ??= { user_id: 1 };

    const user_id = telegrafContext.session.user_id;

    telegrafContext.session.user_id = 100;

    await telegrafContext.reply(
      `${userTelegramName}${TELEGRAM_BOT_MESSAGES.NEW_USER_GREETING} - ${user_id}`,
    );
  }

  @Command('my_profile')
  async myProfile(@Ctx() telegrafContext) {
    const userTelegramName: string =
      telegrafContext?.update?.message?.from?.first_name ||
      telegrafContext?.update?.message?.from?.username;

    await telegrafContext.reply(`${userTelegramName}`);
  }

  @Command('run_app')
  async runApp(@Ctx() telegrafContext) {
    await telegrafContext.reply('app', {
      reply_markup: {
        keyboard: [
          [
            {
              text: 'OctoCommerce',
              web_app: { url: 'https://octocommerce.ir/' },
            },
          ],
        ],
      },
    });
  }
}
