import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Journii } from "../target/types/journii";
import { expect } from "chai";

describe("journii", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Journii as Program<Journii>;
  const provider = anchor.getProvider();

  it("Initializes the program", async () => {
    const [baseAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("base_account"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .initialize()
      .accounts({
        baseAccount: baseAccountPDA,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Initialize transaction signature", tx);

    const account = await program.account.baseAccount.fetch(baseAccountPDA);
    expect(account.count.toNumber()).to.equal(0);
    expect(account.authority.toString()).to.equal(provider.wallet.publicKey.toString());
  });

  it("Increments the counter", async () => {
    const [baseAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("base_account"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .increment()
      .accounts({
        baseAccount: baseAccountPDA,
      })
      .rpc();

    console.log("Increment transaction signature", tx);

    const account = await program.account.baseAccount.fetch(baseAccountPDA);
    expect(account.count.toNumber()).to.equal(1);
  });

  it("Decrements the counter", async () => {
    const [baseAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("base_account"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .decrement()
      .accounts({
        baseAccount: baseAccountPDA,
      })
      .rpc();

    console.log("Decrement transaction signature", tx);

    const account = await program.account.baseAccount.fetch(baseAccountPDA);
    expect(account.count.toNumber()).to.equal(0);
  });
});
