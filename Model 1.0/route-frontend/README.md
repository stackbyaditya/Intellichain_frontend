## Environment Variables

This project uses environment variables for API keys and other sensitive information. A `.env.example` file is provided as a template.

To set up your environment variables:

1.  Create a file named `.env` in the `route-frontend/` directory.
2.  Copy the contents of `.env.example` into your new `.env` file.
3.  Fill in your actual API keys and other values.

**Important:**
*   The `.env` file is for local development only and should **never** be committed to version control.
*   API keys and other sensitive information should be kept secret.

Access environment variables in your code using `import.meta.env.VITE_YOUR_VARIABLE_NAME`.