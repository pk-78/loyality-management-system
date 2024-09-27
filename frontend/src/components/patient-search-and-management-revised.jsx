import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Trash2, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import axiosInstance from "../services/axiosConfig";
import { url } from "../services/Url";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const PatientSearchAndManagement = () => {
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [insideQuerry, setInsideQuerry] = useState("");

  const { register, handleSubmit, reset } = useForm();

  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  // Mock search function

  const handleSearch = (query) => {
    console.log(query);
    setInsideQuerry(query);
    console.log("andr dekh", insideQuerry);

    // Filter patients based on the query
    const filteredResults = patients.filter(
      (patient) =>
        patient.UHID.includes(query) ||
        patient.name.toLowerCase().includes(query.toLowerCase())
    );

    // Set the filtered results
    setSearchResults(filteredResults);
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${url}/patient/getAllPatients`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const getData = await response.json(); // Convert the response to JSON

        console.log("patient data:", getData.patients);
        setPatients(getData.patients);
        // Log the users data
      } catch (error) {
        console.error("Error fetching users:", error); // Handle any errors
      }
    }

    fetchUsers(); // Fetch users on component mount
  }, []);

  // Submit function to handle new patient registration
  async function OnSubmit(data) {
    try {
      const response = await axiosInstance.post(
        `${url}/patient/register`,
        data
      );
      console.log(data);
      if (response.status === 201) {
        toast.success("Patient Added Successfully");
        setPatients([...patients, response.data.patient]);
        reset();
        setShowNewPatientForm(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("ID already exists");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="p-4">
      {/* Patient Search Section */}
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
                  placeholder="Enter Loyalty Card Number"
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
                  {...register("currentPoints", {
                    required: "This field is required",
                  })}
                />
              </div>
              <Button className="w-full">Register Patient</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* User Management Table */}
      {insideQuerry === "" && (
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 font-bold mb-2 p-2 bg-gray-100">
              <div>UHID</div>
              <div>Loyality Card Number</div>
              <div>Name</div>
              <div>Points</div>
            </div>
            <div>
              {patients.map((user) => (
                <div
                  key={user.id} // Use user.id as the key
                  className="grid grid-cols-4 gap-4 p-2 border-b"
                >
                  <div>{user.UHID}</div>
                  <div>{user.LoyalityCard}</div>
                  <div>{user.name}</div>
                  <div>{user.currentPoints}</div>
                  <div>
                    {/* Dialog component wrapping Trigger and Content */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}

      {/* Search Results */}
      {insideQuerry !== "" && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((patient) => (
                <div
                  key={patient.UHID}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <p className="font-bold">{patient.name}</p>
                    <p className="text-sm text-gray-500">
                      UHID: {patient.UHID}
                    </p>
                    <p className="text-sm">Points: {patient.points}</p>
                  </div>
                  <Button
                    onClick={() => navigate("/patient-point")}
                    variant="outline"
                  >
                    Manage Points
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Patient Form */}
    </div>
  );
};

export default PatientSearchAndManagement;
