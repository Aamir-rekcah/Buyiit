/* eslint-disable no-undef */
const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

//Global constants for items listing
const ID = 1
const NAME = "Shoes"
const CATEGORY = "Clothing"
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg"
const COST = tokens(1)
const RATING = 4
const STOCK = 5

describe("Buyiit", () => {
  let buyiit
  let deployer, buyer

  beforeEach(async()=> {
    //Stetingup Accounts
    [deployer, buyer] = await ethers.getSigners()

    //Deploying contract
    const Buyiit = await ethers.getContractFactory("Buyiit")
    buyiit = await Buyiit.deploy() 
  })

  describe("Deployment",()=> {
    it("Sets the owner", async ()=>{
      expect(await buyiit.owner()).to.equal(deployer.address)
    })
  })

  describe("Listing",()=> {
    let transaction 



    beforeEach(async () => {
      transaction = await buyiit.connect(deployer).list(
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        STOCK
      )
      await transaction.wait()
    })

    it("Returns item attributes", async() =>{
      const item = await buyiit.items(ID)
      
      expect(item.id).to.equal(ID)
      expect(item.name).to.equal(NAME)
      expect(item.category).to.equal(CATEGORY)
      expect(item.image).to.equal(IMAGE)
      expect(item.cost).to.equal(COST)
      expect(item.rating).to.equal(RATING)
      expect(item.stock).to.equal(STOCK)
    })

    it("Emits List events", () => {
      expect(transaction).to.emit(buyiit, "List")
    })
  })

  describe("Buying",()=> {
    let transaction 



    beforeEach(async () => {
      transaction = await buyiit.connect(deployer).list(
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        STOCK
      )
      await transaction.wait()

      transaction = await buyiit.connect(buyer).buy(ID,{value: COST})
    })

    it("Updates the contract balance", async() => {
      const result = await ethers.provider.getBalance(buyiit.address)
      expect(result).to.equal(COST)
    })

    it("Updates buyer's order count", async() => {
      const result = await buyiit.orderCount(buyer.address)
      expect(result).to.equal(1)
    })

    it("Adds the order", async() => {
      const order = await buyiit.orders(buyer.address, 1)
      expect(order.time).to.be.greaterThan(0)
      expect(order.item.name).to.equal(NAME)
    })

    it("Emits Buy event", () => {
      expect(transaction).to.emit(buyiit, "Buy")
    })

  })

  describe("Withdrawing", () => {
    let balanceBefore

    beforeEach(async () => {
      // List a item
      let transaction = await buyiit.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()

      // Buy a item
      transaction = await buyiit.connect(buyer).buy(ID, { value: COST })
      await transaction.wait()

      // Get Deployer balance before
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      // Withdraw
      transaction = await buyiit.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const result = await ethers.provider.getBalance(buyiit.address)
      expect(result).to.equal(0)
    })
  })
})
