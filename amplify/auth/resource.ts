// amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend-auth';
// import { postSignUp } from '../functions/postSignUp/resource';
import { preSignUp } from '../auth/pre-sign-up/resource';

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Welcome to Maid Day - Verify Your Account!',
      verificationEmailBody: (createCode) => `
        Welcome to Maid Day! We’re excited to have you on board.
        Use this code to verify your account and start accepting jobs: ${createCode()}.

        Once verified, you can set up your profile, update availability, and start bidding on cleaning jobs in your area.

        Let’s get started! 🚀`,
      userInvitation: {
        emailSubject: 'Welcome to Maid Day - Start Earning Today!',
        emailBody: (user, code) => `
          Hello ${user()},

          Congratulations! You’re one step away from joining **Maid Day**, where you can find cleaning jobs that fit your schedule and earn on your terms.

          Your temporary login credentials:
          - **Username:** ${user()}
          - **Temporary Password:** ${code()}

          Next steps:
          1️⃣ Log in and update your profile.
          2️⃣ Set your availability and service area.
          3️⃣ Start bidding on jobs and earning!

          If you have any questions, check out our Help Center or contact support.

          Welcome to the team! 🎉

          - The Maid Day Team`,
      },
    },
  },
});