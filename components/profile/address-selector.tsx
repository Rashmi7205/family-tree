"use client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Pincode from "india-pincode-search";

interface AddressSelectorProps {
  onAddressSelect: (address: any) => void;
}

export default function AddressSelector({
  onAddressSelect,
}: AddressSelectorProps) {
  const { toast } = useToast();
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [pincodeError, setPincodeError] = useState<string>("");
  const [autoFilled, setAutoFilled] = useState({ city: false, state: false });

  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => {
      const updated = { ...prev, [field]: value };
      onAddressSelect({
        ...updated,
        formatted: [
          updated.street,
          updated.city,
          updated.state,
          updated.country,
          updated.postalCode,
        ]
          .filter(Boolean)
          .join(", "),
        coordinates: null,
      });
      return updated;
    });
    setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    if (field === "postalCode") {
      setPincodeError("");
      if (/^\d{6}$/.test(value)) {
        const result = Pincode.search(value);
        if (result && result.length > 0) {
          setAddress((prev) => {
            const updated = {
              ...prev,
              city: result[0].city,
              state: result[0].state,
            };
            onAddressSelect({
              ...updated,
              formatted: [
                updated.street,
                updated.city,
                updated.state,
                updated.country,
                updated.postalCode,
              ]
                .filter(Boolean)
                .join(", "),
              coordinates: null,
            });
            return updated;
          });
          setAutoFilled({ city: true, state: true });
        } else {
          setPincodeError(
            "Invalid pincode. Please enter a valid 6-digit Indian pincode."
          );
          setAutoFilled({ city: false, state: false });
        }
      } else {
        setAutoFilled({ city: false, state: false });
      }
    }
    if (field === "city" || field === "state") {
      setAutoFilled((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Remove handleManualAddressSubmit and Save Address button

  return (
    <div className="space-y-4">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            placeholder="123 Main St"
            value={address.street}
            onChange={(e) => handleAddressChange("street", e.target.value)}
            autoComplete="address-line1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">
            Postal/ZIP Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="postalCode"
            placeholder="110001"
            value={address.postalCode}
            onChange={(e) => handleAddressChange("postalCode", e.target.value)}
            maxLength={6}
            required
            inputMode="numeric"
            pattern="\d{6}"
          />
          {pincodeError && (
            <p className="text-sm text-red-500">{pincodeError}</p>
          )}
          {errors.postalCode && (
            <p className="text-sm text-red-500">{errors.postalCode}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              placeholder="City"
              value={address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              required
              disabled={autoFilled.city}
              autoComplete="address-level2"
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">
              State/Province <span className="text-red-500">*</span>
            </Label>
            <Input
              id="state"
              placeholder="State/Province"
              value={address.state}
              onChange={(e) => handleAddressChange("state", e.target.value)}
              required
              disabled={autoFilled.state}
              autoComplete="address-level1"
            />
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">
            Country <span className="text-red-500">*</span>
          </Label>
          <Input
            id="country"
            placeholder="Country"
            value={address.country}
            onChange={(e) => handleAddressChange("country", e.target.value)}
            required
            autoComplete="country"
          />
          {errors.country && (
            <p className="text-sm text-red-500">{errors.country}</p>
          )}
        </div>
        {/* No Save Address button here */}
      </form>
      {selectedAddress && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="font-medium">Selected Address:</p>
          <p className="text-sm">{selectedAddress}</p>
        </div>
      )}
    </div>
  );
}
