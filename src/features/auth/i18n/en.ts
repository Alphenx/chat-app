const en = {
  auth: {
    login: {
      form: {
        title: 'Log In',
        fields: {
          email: {
            label: 'Email',
            placeholder: 'Enter your email address',
          },
          password: {
            label: 'Password',
            placeholder: 'Enter your password',
          },
        },
        submit: 'Log In',
      },
      linkToRegister: 'Don’t have an account? Sign up now',
      linkToForgotPassword: 'Forgot your password?',
      rememberMeLabel: 'Remember me',
    },
    register: {
      form: {
        title: 'Create Your Account',
        fields: {
          name: {
            label: 'Full Name',
            placeholder: 'Enter your full name',
          },
          email: {
            label: 'Email',
            placeholder: 'Enter your email address',
          },
          password: {
            label: 'Password',
            placeholder: 'Create a strong password',
          },
          confirmPassword: {
            label: 'Confirm Password',
            placeholder: 'Re-enter your password',
          },
        },
        errors: {
          name: {
            required: 'Please provide your full name',
          },
          email: {
            required: 'Email is required',
            invalid: 'Please enter a valid email address',
          },
          password: {
            required: 'Password is required',
            requirements: 'Password must meet the security requirements',
            mismatch: 'Passwords do not match',
          },
        },
        submit: 'Sign Up',
      },
      linkToLogin: 'Already have an account? Log in here',
      feedback: {
        emailVerification:
          'We’ve sent a verification email to your inbox. Please check it to verify your account.',
      },
    },
    alternativeMethods: {
      google: 'Sign in with Google',
    },
    forgotPassword: {
      forgot: {
        form: {
          title: 'Recover Your Account',
          fields: {
            email: {
              label: 'Email',
              placeholder: 'Enter your email address',
            },
          },
          submit: 'Send Recovery Link',
        },
        feedback: {
          emailVerification: 'We’ve sent a recovery link to your email. Check your inbox.',
        },
        linkToLogin: 'Return to Log In',
      },
      reset: {
        form: {
          title: 'Set a New Password',
          fields: {
            password: {
              label: 'New Password',
              placeholder: 'Enter a new password',
            },
            confirmPassword: {
              label: 'Confirm New Password',
              placeholder: 'Re-enter the new password',
            },
          },
          submit: 'Reset Password',
          errors: {
            password: {
              required: 'New password is required',
              requirements: 'Password must meet the security requirements',
              mismatch: 'Passwords do not match',
            },
          },
        },
        feedback: {
          passwordReset: 'Your password has been successfully reset.',
        },
        linkToLogin: 'Return to Log In',
      },
    },
    errors: {
      defaultError: 'An error occurred. Please try again later.',
      invalidCredentials: 'Incorrect email or password.',
      userAlreadyExists: 'An account with this email already exists.',
      userNotFound: 'No account found with this email.',
      unauthorized: 'You are not authorized to perform this action.',
      emailNotValidated: 'Please verify your email to continue.',
      invalidToken: 'The link is invalid or has expired.',
    },
    passwordRequirements: {
      length: 'Must be at least 8 characters long',
      case: 'Include both uppercase and lowercase letters',
      number: 'Include at least one number',
      special: 'Include at least one special character',
    },
  },
} as const;

export default en;
