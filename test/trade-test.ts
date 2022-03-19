import { ethers } from "hardhat";
import { Contract, Wallet, utils } from "ethers";
import { expect } from "chai";
import { basicContext, Context } from "../scripts/context";
import {
  buildOrder,
  encodeTradeData,
  getDefaultOrderEnv,
  OrderEnv,
} from "../scripts/order";

describe("Trade", () => {
  let context: Context;
  let trader1: Wallet;
  let trader2: Wallet;
  let trader3: Wallet;
  let orderEnv: OrderEnv;

  beforeEach(async () => {
    context = await basicContext();
    trader1 = context.traderList[0];
    trader2 = context.traderList[1];
    trader3 = context.traderList[1];
    await context.dealer.setVirtualCredit(
      trader1.address,
      utils.parseEther("1000000")
    );
    await context.dealer.setVirtualCredit(
      trader2.address,
      utils.parseEther("1000000")
    );
    await context.dealer.setVirtualCredit(
      trader3.address,
      utils.parseEther("1000000")
    );
    orderEnv = await getDefaultOrderEnv(context.dealer);
  });

  it("match single order", async () => {
    let o1 = await buildOrder(
      orderEnv,
      context.perpList[0].address,
      utils.parseEther("1").toString(),
      utils.parseEther("-30000").toString(),
      trader1
    );
    let o2 = await buildOrder(
      orderEnv,
      context.perpList[0].address,
      utils.parseEther("-1").toString(),
      utils.parseEther("30000").toString(),
      trader2
    );
    
    let encodedTradeData = encodeTradeData(
      [o1.order, o2.order],
      [o1.signature, o2.signature],
      [utils.parseEther("1").toString(), utils.parseEther("1").toString()]
    );
    await context.perpList[0].trade(encodedTradeData)
    console.log(await context.perpList[0].balanceOf(trader1.address),trader1.address)
    console.log(await context.perpList[0].balanceOf(trader2.address),trader2.address)
    console.log(await context.perpList[0].balanceOf(context.ownerAddress),context.ownerAddress)
  });

  //   it('Assigns initial balance', async () => {
  //       const gretter = await ethers.getContractFactory("")
  //     expect(await token.balanceOf(wallet.address)).to.equal(1000);
  //   });

  //   it('Transfer adds amount to destination account', async () => {
  //     await token.transfer(walletTo.address, 7);
  //     expect(await token.balanceOf(walletTo.address)).to.equal(7);
  //   });

  //   it('Transfer emits event', async () => {
  //     await expect(token.transfer(walletTo.address, 7))
  //       .to.emit(token, 'Transfer')
  //       .withArgs(wallet.address, walletTo.address, 7);
  //   });

  //   it('Can not transfer above the amount', async () => {
  //     await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
  //   });

  //   it('Can not transfer from empty account', async () => {
  //     const tokenFromOtherWallet = token.connect(walletTo);
  //     await expect(tokenFromOtherWallet.transfer(wallet.address, 1))
  //       .to.be.reverted;
  //   });

  //   it('Calls totalSupply on BasicToken contract', async () => {
  //     await token.totalSupply();
  //     expect('totalSupply').to.be.calledOnContract(token);
  //   });

  //   it('Calls balanceOf with sender address on BasicToken contract', async () => {
  //     await token.balanceOf(wallet.address);
  //     expect('balanceOf').to.be.calledOnContractWith(token, [wallet.address]);
  //   });
});