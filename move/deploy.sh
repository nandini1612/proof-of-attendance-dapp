#!/bin/bash

# Proof of Attendance dApp Deployment Script
# This script deploys the smart contract to Aptos Devnet

set -e

echo "🚀 Starting Proof of Attendance dApp deployment..."

# Check if Aptos CLI is installed
if ! command -v aptos &> /dev/null; then
    echo "❌ Aptos CLI is not installed. Please install it first:"
    echo "   curl -fsSL \"https://aptos.dev/scripts/install_cli.py\" | python3"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "Move.toml" ]; then
    echo "❌ Move.toml not found. Please run this script from the move/ directory."
    exit 1
fi

echo "✅ Aptos CLI found"

# Initialize Aptos account if it doesn't exist
if [ ! -f ".aptos/config.yaml" ]; then
    echo "📝 Initializing new Aptos account..."
    aptos init --network devnet
else
    echo "✅ Aptos account already initialized"
fi

# Get the account address
ACCOUNT_ADDRESS=$(aptos account list --query balance --profile default 2>/dev/null | grep -o "0x[a-fA-F0-9]*" | head -1)

if [ -z "$ACCOUNT_ADDRESS" ]; then
    echo "❌ Could not retrieve account address"
    exit 1
fi

echo "📍 Account address: $ACCOUNT_ADDRESS"

# Check account balance
echo "💰 Checking account balance..."
BALANCE=$(aptos account list --query balance --profile default 2>/dev/null | grep -o "[0-9]*" | head -1)

if [ -z "$BALANCE" ] || [ "$BALANCE" -lt 100000000 ]; then
    echo "💸 Funding account with test APT..."
    aptos account fund-with-faucet --profile default
    echo "✅ Account funded"
else
    echo "✅ Account has sufficient balance: $BALANCE octas"
fi

# Update Move.toml with the actual account address
echo "📝 Updating Move.toml with account address..."
sed -i.bak "s/MyModule = \"_\"/MyModule = \"$ACCOUNT_ADDRESS\"/" Move.toml
sed -i.bak "s/MyModule = \"0x123\"/MyModule = \"$ACCOUNT_ADDRESS\"/" Move.toml

echo "🔨 Compiling Move contract..."
aptos move compile --profile default

echo "📦 Publishing Move contract to Devnet..."
aptos move publish --profile default --assume-yes

if [ $? -eq 0 ]; then
    echo "✅ Contract published successfully!"
    echo ""
    echo "📋 Deployment Summary:"
    echo "   Network: Aptos Devnet"
    echo "   Account: $ACCOUNT_ADDRESS"
    echo "   Module: ${ACCOUNT_ADDRESS}::ProofOfAttendance"
    echo ""
    echo "🔧 Next steps:"
    echo "   1. Update frontend/src/utils/aptosClient.ts with MODULE_ADDRESS = \"$ACCOUNT_ADDRESS\""
    echo "   2. Initialize the contract by calling the initialize function"
    echo "   3. Start the frontend application"
    echo ""
    echo "🎯 Initialize contract command:"
    echo "   aptos move run --function-id ${ACCOUNT_ADDRESS}::ProofOfAttendance::initialize --profile default"
else
    echo "❌ Contract publication failed"
    exit 1
fi

# Initialize the contract
echo "🎯 Initializing contract..."
aptos move run --function-id "${ACCOUNT_ADDRESS}::ProofOfAttendance::initialize" --profile default --assume-yes

if [ $? -eq 0 ]; then
    echo "✅ Contract initialized successfully!"
else
    echo "⚠️  Contract initialization failed, but you can try again later"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📝 Don't forget to:"
echo "   1. Update the MODULE_ADDRESS in frontend/src/utils/aptosClient.ts"
echo "   2. Install frontend dependencies: cd ../frontend && npm install"
echo "   3. Start the development server: npm run dev"