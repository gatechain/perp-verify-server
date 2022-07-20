# Perp Verify


## How to run The Perp Verify

1. Modify Config `config/config.local.js` or `config/config.prod.js`.

   ```
   config.local.js # Test environment configuration file
   config.prod.js  # Production environment configuration file
   
   # Modify Node runtime environment
   vim .env
   # Test environment
   # local # The test environment is commented here
   # Production environment
   # prod  # The production environment is commented here
   ```
2. `npm i` - Installing Node dependencies

3. `npm run dev` - Debug the environment and output the debug log
   
   `npm run start` - Start the environment with the log output in the log file
   
4. GateChain Explorer Access by http://[IP]:[PORT]