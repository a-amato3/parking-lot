class Vehicle {
  constructor(public type: string, public spotSize: number) {}
}

class Motorcycle extends Vehicle {
  constructor(public spotSize: number) {
    super("Motorcycle", spotSize);
  }

  // Motorcycle specific properties and methods
  // Example:
  startEngine() {
    console.log("Starting the motorcycle engine...");
  }
}

class Car extends Vehicle {
  constructor(public spotSize: number) {
    super("Car", spotSize);
  }

  // Car specific properties and methods
  // Example:
  openTrunk() {
    console.log("Opening the car trunk...");
  }
}

class Bus extends Vehicle {
  constructor(public spotSize: number) {
    super("Bus", spotSize);
  }

  // Bus specific properties and methods
  // Example:
  announceDeparture() {
    console.log("Attention passengers, the bus is departing...");
  }
}

class ParkingLot {
  private motorcycleSpots: number;
  private carSpots: number;
  private busSpots: number;
  private vehicles: Map<string, { vehicle: Vehicle; entryTime: Date }>;

  constructor(motorcycleSpots: number, carSpots: number, busSpots: number) {
    this.motorcycleSpots = motorcycleSpots;
    this.carSpots = carSpots;
    this.busSpots = busSpots;
    this.vehicles = new Map();
  }

  park(vehicle: Vehicle): string {
    let spotType = "";
    let availableSpots = 0;

    if (vehicle instanceof Motorcycle) {
      spotType = "motorcycleSpots";
      availableSpots = this.motorcycleSpots;
    } else if (vehicle instanceof Car) {
      spotType = "carSpots";
      availableSpots = this.carSpots;
    } else if (vehicle instanceof Bus) {
      spotType = "busSpots";
      availableSpots = this.busSpots;
    }

    if (availableSpots > 0) {
      const ticketNumber = this.generateTicketNumber();
      this.vehicles.set(ticketNumber, { vehicle, entryTime: new Date() });
      this[spotType]--;
      return ticketNumber;
    }

    return "";
  }

  unpark(ticketNumber: string): Receipt | null {
    if (this.vehicles.has(ticketNumber)) {
      const { vehicle, entryTime } = this.vehicles.get(ticketNumber)!;
      const exitTime = new Date();
      const durationInMillis = exitTime.getTime() - entryTime.getTime();
      const durationInHours = Math.ceil(durationInMillis / (1000 * 60 * 60));

      let feeModel;
      if (vehicle instanceof Motorcycle) {
        feeModel = new MallFeeModel();
      } else if (vehicle instanceof Car) {
        feeModel = new StadiumFeeModel();
      } else if (vehicle instanceof Bus) {
        feeModel = new AirportFeeModel();
      }

      const fees = feeModel.calculateFees(vehicle, durationInHours);
      const receipt = new Receipt(ticketNumber, entryTime, exitTime, fees);

      this[`${vehicle.type.toLowerCase()}Spots`]++; // Free up the spot
      this.vehicles.delete(ticketNumber); // Remove the vehicle from the map

      return receipt;
    }

    return null;
  }

  private generateTicketNumber(): string {
    const randomString = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    return `T-${randomString}`;
  }
}

class MallFeeModel {
  private feeTable = new Map<string, number>([
    ["Motorcycle", 10],
    ["Car", 20],
    ["Bus", 50],
  ]);

  calculateFees(vehicle: Vehicle, durationInHours: number): number {
    const fee = this.feeTable.get(vehicle.type);
    if (fee !== undefined) {
      return fee * durationInHours;
    }
    return 0;
  }
}

class StadiumFeeModel {
  private feeTable = new Map<string, number[]>([
    ["Motorcycle", [30, 60, 100]],
    ["Car", [60, 120, 200]],
  ]);

  calculateFees(vehicle: Vehicle, durationInHours: number): number {
    const fees = this.feeTable.get(vehicle.type);
    if (fees !== undefined) {
      let totalFee = 0;
      for (let i = 0; i < fees.length; i++) {
        const [startHour, fee] = [i * 4, fees[i]];
        if (durationInHours >= startHour) {
          totalFee += fee;
        }
      }
      return totalFee;
    }
    return 0;
  }
}

class AirportFeeModel {
  private feeTable = new Map<string, number[]>([
    ["Motorcycle", [0, 40, 60]],
    ["Car", [60, 80, 100]],
  ]);

  calculateFees(vehicle: Vehicle, durationInHours: number): number {
    const fees = this.feeTable.get(vehicle.type);
    if (fees !== undefined) {
      let totalFee = 0;
      for (let i = 0; i < fees.length; i++) {
        const [startHour, fee] = [i * 8, fees[i]];
        if (durationInHours >= startHour) {
          totalFee += fee;
        }
      }
      return totalFee;
    }
    return 0;
  }
}

class Ticket {
  constructor(
    public ticketNumber: string,
    public spotNumber: number,
    public entryTime: Date
  ) {}
}

class Receipt {
  constructor(
    public receiptNumber: string,
    public entryTime: Date,
    public exitTime: Date,
    public fees: number
  ) {}
}
