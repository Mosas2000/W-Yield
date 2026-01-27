const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { vaultFixture, vaultWithDepositsFixture } = require("./helpers/fixtures");
const { setupUser, deposit, withdraw } = require("./helpers/utils");
const { MIN_DEPOSIT, MAX_DEPOSIT } = require("./helpers/constants");

describe("WealthVault - Refactored", function () {
    describe("Deployment", function () {
        it("Should deploy correctly", async function () {
            const { vault, usdc } = await loadFixture(vaultFixture);
            expect(await vault.usdc()).to.equal(await usdc.getAddress());
        });
    });
    
    describe("Deposits", function () {
        it("Should handle deposit", async function () {
            const { vault, usdc, user1 } = await loadFixture(vaultFixture);
            await setupUser(usdc, vault, user1, MIN_DEPOSIT);
            await deposit(vault, user1, MIN_DEPOSIT);
            expect(await vault.balanceOf(user1.address)).to.equal(MIN_DEPOSIT);
        });
    });
    
    describe("Withdrawals", function () {
        it("Should handle withdrawal", async function () {
            const { vault, user1 } = await loadFixture(vaultWithDepositsFixture);
            const shares = await vault.balanceOf(user1.address);
            await withdraw(vault, user1, shares);
            expect(await vault.balanceOf(user1.address)).to.equal(0);
        });
    });
});
