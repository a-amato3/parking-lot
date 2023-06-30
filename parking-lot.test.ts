const { expect } = require("jest");

describe("ParkingLot", () => {
  let parkingLot;

  beforeEach(() => {
    parkingLot = new ParkingLot(10, 10, 5);
  });

  afterEach(() => {
    parkingLot = null;
  });

  describe("park", () => {
    it("should park a motorcycle and return a ticket number", () => {
      const motorcycle = new Motorcycle(1);
      const ticketNumber = parkingLot.park(motorcycle);
      expect(ticketNumber).toMatch(/^T-[A-Z0-9]{6}$/);
    });

    it("should park a car and return a ticket number", () => {
      const car = new Car(1);
      const ticketNumber = parkingLot.park(car);
      expect(ticketNumber).toMatch(/^T-[A-Z0-9]{6}$/);
    });

    it("should park a bus and return a ticket number", () => {
      const bus = new Bus(3);
      const ticketNumber = parkingLot.park(bus);
      expect(ticketNumber).toMatch(/^T-[A-Z0-9]{6}$/);
    });

    it("should not park a vehicle when there are no available spots", () => {
      const motorcycle1 = new Motorcycle(1);
      const motorcycle2 = new Motorcycle(1);
      parkingLot.park(motorcycle1);
      parkingLot.park(motorcycle2);
      const motorcycle3 = new Motorcycle(1);
      const ticketNumber = parkingLot.park(motorcycle3);
      expect(ticketNumber).toBe("");
    });
  });

  describe("unpark", () => {
    it("should return the receipt when a valid ticket number is provided", () => {
      const motorcycle = new Motorcycle(1);
      const ticketNumber = parkingLot.park(motorcycle);
      const receipt = parkingLot.unpark(ticketNumber);
      expect(receipt).not.toBeNull();
      expect(receipt.receiptNumber).toMatch(/^T-[A-Z0-9]{6}$/);
      expect(receipt.entryTime).toBeInstanceOf(Date);
      expect(receipt.exitTime).toBeInstanceOf(Date);
      expect(receipt.fees).toBeGreaterThanOrEqual(0);
    });

    it("should return null when an invalid ticket number is provided", () => {
      const receipt = parkingLot.unpark("INVALID_TICKET_NUMBER");
      expect(receipt).toBeNull();
    });
  });
});
