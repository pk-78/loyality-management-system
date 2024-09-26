import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import axiosInstance from "../services/axiosConfig";
import { url } from "../services/Url";
import toast from "react-hot-toast";

const PatientSearchAndManagement = () => {
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const {
    register,
    handleSubmit,
    // formState: { errors },,
    reset,
  } = useForm();

  // Mock search function
  const handleSearch = (query) => {
    // In a real app, this would call an API
    setSearchResults([
      { uhid: "12345", name: "John Doe", points: 500 },
      { uhid: "67890", name: "Jane Smith", points: 750 },
    ]);
  };
  // function OnSubmit(data) {
  //   console.log(data);
  //   axiosInstance
  //     .post(`${url}/patient/register`, data)
  //     .then((response) => {
  //       console.log(response);
  //       console.log("Success:", response.data);
  //       toast.success("User Added Successfully");
  //       setIsAddDialogOpen(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  //   reset();
  // }

  async function OnSubmit(data) {
    console.log(data);
    try {
      // Send login request to backend
      const response = await axiosInstance.post(
        `${url}/patient/register`,
        data
      );
      console.log(response);
      // Handle success
      if (response.status === 201) {
        toast.success("Patient Added Successfully");
        // Store token and user data if needed
        // localStorage.setItem("token", response.data.token);
        // localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      // Handle errors
      if (error.response && error.response.status === 400) {
        toast.error("Id already Exist");
      } else {
        setLoginError("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Patient Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Search by name or UHID"
              className="flex-grow"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Button>
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
            <Button onClick={() => setShowNewPatientForm(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> New Patient
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((patient) => (
                <div
                  key={patient.uhid}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <p className="font-bold">{patient.name}</p>
                    <p className="text-sm text-gray-500">
                      UHID: {patient.uhid}
                    </p>
                    <p className="text-sm">Points: {patient.points}</p>
                  </div>
                  <Button variant="outline">Manage Points</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showNewPatientForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Patient Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(OnSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="uhid">UHID</Label>
                <Input
                  id="uhid"
                  placeholder="Enter Unique Health ID"
                  {...register("UHID", { required: "This field is required" })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="LCN">Loyalty Card Number</Label>
                <Input
                  id="LCN"
                  placeholder="Enter Loyality Card Number"
                  {...register("LoyalityCard", {
                    required: "This field is required",
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter patient's full name"
                  {...register("name", { required: "This field is required" })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initial-points">Initial Points</Label>
                <Input
                  id="initial-points"
                  type="number"
                  placeholder="Enter initial points"
                  {...register("CurrentPoints", {
                    required: "This field is required",
                  })}
                />
              </div>
              <Button className="w-full">Register Patient</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientSearchAndManagement;
