declare module "india-pincode-search" {
  interface PincodeResult {
    pincode: string;
    office: string;
    officeType: string;
    delivery: string;
    division: string;
    region: string;
    circle: string;
    taluk: string;
    district: string;
    state: string;
    city: string;
  }
  interface Pincode {
    search(pincode: string): PincodeResult[];
  }
  const Pincode: Pincode;
  export default Pincode;
}
