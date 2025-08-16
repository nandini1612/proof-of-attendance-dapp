# Proof of Attendance dApp

A complete decentralized application (dApp) built on the Aptos blockchain that allows event organizers to create events and users to claim attendance badges as proof of participation.
<img width="2550" height="1405" alt="Screenshot 2025-08-16 154848" src="https://github.com/user-attachments/assets/d566ca46-2789-4a03-8c84-940d1696adff" />


## 🌟 Features

- **Event Creation**: Organizers can create events with custom names
- **Attendance Claiming**: Users can claim attendance badges for events they attend
- **Badge Collection**: Users can view their collected attendance badges
- **Wallet Integration**: Seamless integration with Aptos wallets (Petra, Martian, etc.)
- **Real-time Updates**: Live updates of attendance counts and event data
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🏗️ Architecture

### Smart Contract (Move)
- **Language**: Move
- **Network**: Aptos Devnet
- **Features**: Event creation, attendance tracking, duplicate prevention

### Frontend
- **Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Wallet**: Aptos Wallet Adapter
- **SDK**: Aptos TypeScript SDK

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Aptos CLI](https://aptos.dev/cli-tools/aptos-cli-tool/install-aptos-cli/)
- An Aptos wallet ([Petra](https://petra.app/) or [Martian](https://martianwallet.xyz/))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd proof-of-attendance-dapp
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install
```

### 3. Deploy Smart Contract

```bash
# Navigate to the move directory
mkdir move
cd move

# Copy the Move.toml and source files
# (Use the provided Move.toml and ProofOfAttendance.move files)

# Make the deployment script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

The deployment script will:
- Initialize an Aptos account
- Fund the account with test APT
- Compile and deploy the smart contract
- Initialize the contract registry

### 4. Configure Frontend

After deployment, update the MODULE_ADDRESS in `src/utils/aptosClient.ts`:

```typescript
const MODULE_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // Replace with actual address
```

### 5. Start Development Server

```bash
# Navigate back to the frontend directory
cd ../

# Start the development server
npm run dev
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
proof-of-attendance-dapp/
├── move/                           # Smart contract files
│   ├── Move.toml                   # Move package configuration
│   ├── sources/
│   │   └── ProofOfAttendance.move  # Main smart contract
│   └── deploy.sh                   # Deployment script
├── src/                            # Frontend source code
│   ├── components/                 # React components
│   │   ├── WalletSelector.tsx      # Wallet connection component
│   │   ├── EventCreation.tsx       # Event creation form
│   │   ├── EventsList.tsx          # Events display component
│   │   ├── AttendanceHistory.tsx   # User badges display
│   │   └── Header.tsx              # Application header
│   ├── utils/
│   │   └── aptosClient.ts          # Blockchain integration
│   ├── types/
│   │   └── index.ts                # TypeScript definitions
│   ├── App.tsx                     # Main application component
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Global styles
├── package.json                    # Dependencies and scripts
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── .env.example                    # Environment variables template
└── README.md                       # This file
```

## 🔧 Smart Contract Functions

### Public Entry Functions

1. **initialize(admin: &signer)**
   - Initializes the global event registry
   - Must be called once after deployment

2. **create_event(organizer: &signer, event_name: vector<u8>)**
   - Creates a new event
   - Each account can only create one event

3. **claim_attendance(attendee: &signer, event_organizer: address)**
   - Claims attendance for an event
   - Prevents duplicate claims

### View Functions

1. **get_event(event_organizer: address): (String, u64, u64)**
   - Returns event name, attendance count, and creation timestamp

2. **has_attended(attendee: address, event_organizer: address): bool**
   - Checks if a user has attended a specific event

3. **get_all_events(): vector<address>**
   - Returns all event organizer addresses

## 💡 Usage Guide

### For Event Organizers

1. **Connect Your Wallet**
   - Click "Connect Wallet" and select your Aptos wallet
   - Approve the connection

2. **Create an Event**
   - Navigate to the "Create Event" tab
   - Enter your event name
   - Click "Create Event" and approve the transaction

3. **Share Your Event**
   - Share your wallet address with attendees
   - Attendees will use this address to claim attendance

### For Event Attendees

1. **Connect Your Wallet**
   - Click "Connect Wallet" and select your Aptos wallet

2. **Claim Attendance**
   - Find the event in the "Events" tab
   - Click "Claim Attendance" for the event you attended
   - Approve the transaction

3. **View Your Badges**
   - Check the "My Badges" tab to see all your attendance badges

## 🔍 Testing

### Manual Testing Checklist

- [ ] Wallet connection works with different Aptos wallets
- [ ] Event creation creates events successfully
- [ ] Event list displays all available events
- [ ] Attendance claiming works and prevents duplicates
- [ ] Badge collection shows user's attended events
- [ ] Error handling works for edge cases
- [ ] Responsive design works on mobile devices

### Test Scenarios

1. **Happy Path**
   - Create event → Claim attendance → View badges

2. **Error Cases**
   - Try to create multiple events with same account
   - Try to claim attendance twice for same event
   - Try to claim attendance for non-existent event

## 🚨 Troubleshooting

### Common Issues

1. **"Transaction failed" errors**
   - Ensure you have sufficient APT balance
   - Check if the contract is properly deployed
   - Verify the MODULE_ADDRESS is correct

2. **"No wallets found" message**
   - Install Petra or Martian wallet extension
   - Refresh the page after wallet installation

3. **Contract deployment fails**
   - Ensure Aptos CLI is properly installed
   - Check your internet connection
   - Try funding your account manually with the faucet

4. **Events not loading**
   - Verify the contract is initialized
   - Check browser console for errors
   - Ensure you're connected to Devnet

### Debug Commands

```bash
# Check account balance
aptos account list --query balance --profile default

# Fund account manually
aptos account fund-with-faucet --profile default

# View account resources
aptos account list --query resources --profile default

# Check contract deployment
aptos move view --function-id "YOUR_ADDRESS::ProofOfAttendance::get_all_events"
```

## 🌐 Deployment to Production

### Mainnet Deployment

1. Update network configuration:
   ```typescript
   const aptosConfig = new AptosConfig({ network: Network.MAINNET });
   ```

2. Update Move.toml for mainnet:
   ```toml
   [dependencies.AptosFramework]
   git = "https://github.com/aptos-labs/aptos-core.git"
   rev = "mainnet"
   ```

3. Deploy contract:
   ```bash
   aptos init --network mainnet
   ./deploy.sh
   ```

### Frontend Hosting

Deploy to Vercel, Netlify, or any static hosting service:

```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting service
```

## 📚 Learn More

- [Aptos Documentation](https://aptos.dev/)
- [Move Language Guide](https://move-language.github.io/move/)
- [Aptos TypeScript SDK](https://github.com/aptos-labs/aptos-ts-sdk)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Aptos team for the excellent blockchain infrastructure
- Move language developers
- React and Tailwind CSS communities

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Join the Aptos Discord community

---

**Happy Building! **
