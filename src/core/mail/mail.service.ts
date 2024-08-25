import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { getStaticTemplate } from 'src/lib'

const EMAIL_SENDER = 'admin@talad.co.com'

@Injectable()
export class MailService {
  constructor(private service: MailerService) {}

  async confirmationRegister({ email, code }: { email: string; code: string }) {
    const html = getStaticTemplate('verify-email').replace(/\[code\]/g, code)

    await this.service.sendMail({
      to: email,
      html,
      from: EMAIL_SENDER,
      subject: 'ยืนยันการสมัครสมาชิก',
      sender: EMAIL_SENDER,
    })
  }
}
