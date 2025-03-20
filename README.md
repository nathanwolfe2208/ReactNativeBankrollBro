## Description

This is an Expo application that integrates with Supabase for backend services, including authentication and storage. The app allows users to manage their profiles and upload files seamlessly.

## Getting Started

### Prerequisites

- Node.js installed on your machine
- Expo CLI installed globally

### Installation Steps

1. **Clone the Repository**

   ```
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   
   ```
2. **Install Dependencies**

   ```
   npm install
   
   ```
3. **Set Up Environment Variables**

   ```
   EXPO_PUBLIC_SUPABASE_URL=
   EXPO_PUBLIC_SUPABASE_ANON_KEY=
   
   ```
4. **Start the Development Server**

   ```
   npx expo start
   
   ```

### Testing the App

- You can test the app on your device using the Expo Go app or in an emulator.
- To run the app on a specific platform, follow the prompts in the terminal after starting the development server.

## Environment Variables Setup

### Explanation of Environment Variables

- **EXPO_PUBLIC_SUPABASE_URL**: This is the URL for your Supabase project, which allows the app to connect to the Supabase backend.
- **EXPO_PUBLIC_SUPABASE_ANON_KEY**: This is the public anonymous key for your Supabase project, used for client-side authentication and accessing public resources.

### How to Use Environment Variables

- Ensure that you have dotenv installed
- dotenv is a package to manage environment variables.
- Access these variables in your code using:
  ```
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  
  ```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
