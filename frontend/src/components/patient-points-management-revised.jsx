import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, PlusCircle, MinusCircle, Clock, User } from "lucide-react";
import { url } from "../services/Url";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axiosInstance from "../services/axiosConfig";
import toast from "react-hot-toast";

const PatientPointsManagement = () => {
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [points, setPoints] = useState(500);
  const [currentPoints, setCurrentPoints] = useState("");
  const [transactionType, setTransactionType] = useState("Add");
  const [remarks, setRemarks] = useState("");
  const [desk, setDesk] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { id } = useParams();

  useEffect(() => {
    async function fetchPatient() {
      try {
        const response = await fetch(`${url}/patient/patients/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const getData = await response.json();
        setPatient(getData.patient);
        setCurrentPoints(getData.patient?.currentPoints);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setIsLoading(false);
      }
    }

    fetchPatient();
  }, [id]);

  const [transactions, setTransactions] = useState([
    {
      date: "2024-09-23",
      type: "Add",
      amount: 100,
      remarks: "Welcome bonus",
      desk: "Front Desk",
    },
    {
      date: "2024-09-24",
      type: "Deduct",
      amount: 50,
      remarks: "Redeemed for discount",
      desk: "Billing Desk",
    },
  ]);

  async function OnSubmit(data) {
    console.log("Form data:", data);
    const pointsInt = parseInt(data.points, 10);
  
    try {
      const response = await axiosInstance.post(
        `${url}/patient/patients/${id}/transaction`,
        {
          desk: data.desk,
          points: pointsInt,
          remarks: data.remarks,
          transactionType: data.transactionType,
        }
      );
      console.log(response);
  
      if (response.status === 200) {
        toast.success("Changed Successful");
        
        // Update current points based on the transaction type
        const newCurrentPoints =
          data.transactionType === "Add"
            ? currentPoints + pointsInt
            : currentPoints - pointsInt;
  
        setCurrentPoints(newCurrentPoints); // Update the current points state
        setPoints(newCurrentPoints); // Update the points state if needed
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  
    // Log the new points for further use
    const newTransaction = {
      date: new Date().toISOString().split("T")[0],
      type: data.transactionType,
      amount: pointsInt,
      remarks: data.remarks,
      desk: data.desk,
    };
  
    console.log("New transaction:", newTransaction);
  
    setTransactions([...transactions, newTransaction]);
  }
  

  return (
    <div className="p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading patient data...</p>
          ) : (
            <div className="flex items-center space-x-4">
              <User className="h-6 w-6" />
              <div>
                <p className="font-bold text-lg">{patient?.name}</p>
                <p className="text-sm text-gray-500">UHID: {patient?.UHID}</p>
                <p className="text-sm text-gray-500 flex items-center">
                  <CreditCard className="h-4 w-4 mr-1" />
                  Loyalty Card: {patient?.LoyalityCard}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Points</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading points...</p>
            ) : (
              <div className="flex items-center justify-center">
                <CreditCard className="mr-2 h-6 w-6" />
                <span className="text-4xl font-bold">{currentPoints}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add/Deduct Points</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(OnSubmit)}>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  placeholder="Enter Points"
                  {...register("points", {
                    required: "This field is required",
                  })}
                />
                {errors.points && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.points?.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <Label htmlFor="transaction" className="mb-4">
                  Transaction Type
                </Label>
                <select
                  id="transaction"
                  name="transaction"
                  {...register("transactionType", {
                    required: "Role is required",
                  })}
                >
                  <option value="">Select Transcation Type</option>
                  <option value="Add">Add</option>
                  <option value="Deduct">Deduct</option>
                </select>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="desk" className="mb-4">
                  Desk
                </Label>
                <select
                  id="desk"
                  name="desk"
                  {...register("desk", {
                    required: "Role is required",
                  })}
                >
                  <option value="">Select Desk</option>
                  <option value="Front Desk">Front Desk</option>
                  <option value="Billing Desk">Billing Desk</option>
                  <option value="Pharmacy Desk">Pharmacy Desk</option>
                </select>
              </div>
              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Input
                  id="remarks"
                  placeholder="Your Remarks"
                  {...register("remarks", {
                    required: "This field is required",
                  })}
                />
                {errors.remarks && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.remarks?.message}
                  </p>
                )}
              </div>

              <Button type="submit">Submit Transaction</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <p className="font-bold">
                    {transaction.type} {transaction.amount} points
                  </p>
                  <p className="text-sm text-gray-500">{transaction.remarks}</p>
                  <p className="text-sm text-gray-500">
                    Desk: {transaction.desk}
                  </p>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{transaction.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientPointsManagement;
