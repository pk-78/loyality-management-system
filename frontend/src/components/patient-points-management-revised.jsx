import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, PlusCircle, MinusCircle, Clock, User } from "lucide-react";
import { url } from "../services/Url";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axiosInstance from "../services/axiosConfig";
import toast from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";

const PatientPointsManagement = ({ isUsername }) => {
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [currentPoints, setCurrentPoints] = useState("");
  const transactionUserId = localStorage.getItem("userId") || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPatient() {
      setIsLoading(true); // Set loading to true when fetching data
      try {
        const response = await fetch(`${url}/patient/patients/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const getData = await response.json();
        setPatient(getData.patient);

        setCurrentPoints(getData.patient?.currentPoints);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    }

    async function fetchTransactions() {
      setIsLoading(true); // Set loading to true when fetching transactions
      try {
        const response = await fetch(`${url}/patient/transactions/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch transactions");

        const transactionData = await response.json();
        setTransactions(transactionData.transactions);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    }

    fetchPatient();
    fetchTransactions();
  }, [id]);

  const [transactions, setTransactions] = useState([]);

  async function OnSubmit(data) {
    const pointsInt = parseInt(data.points, 10);
    setButtonLoading(true);
    try {
      const response = await axiosInstance.post(
        `${url}/patient/patients/${id}/transaction`,
        {
          desk: data.desk,
          points: pointsInt,
          remarks: data.remarks,
          transactionType: data.transactionType,
          transactionUsername: data.transactionUsername,
        }
      );

      if (response.status === 200) {
        toast.success("Transaction Successful");
        const newCurrentPoints =
          data.transactionType === "Add"
            ? currentPoints + pointsInt
            : currentPoints - pointsInt;

        setCurrentPoints(newCurrentPoints);
        setTransactions([
          ...transactions,
          {
            ...data,
            amount: pointsInt,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setButtonLoading(false);
  }

  return (
    <div className="p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex gap-2">
            {" "}
            <IoMdArrowRoundBack
              className="cursor-pointer"
              onClick={() => {
                navigate(-1);
              }}
            />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-start items-center text-sm pl-28 pt-14">
              <div className="spinner text-sm "></div>
            </div>
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
              <div className="flex justify-center items-center text-sm">
                <div className="spinner"></div>
              </div>
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
            <form className="space-y-2" onSubmit={handleSubmit(OnSubmit)}>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  placeholder="Enter Points"
                  {...register("points", {
                    required: "This field is required",
                  })}
                  disabled={isLoading}
                />
                {errors.points && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.points?.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="points">User</Label>
                <Input
                  id="currentUser"
                  placeholder="currentUser"
                  defaultValue={transactionUserId}
                  {...register("transactionUsername", {
                    required: "This field is required",
                  })}
                  readOnly
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
                    required: "Transaction Type is required",
                  })}
                  disabled={isLoading}
                >
                  <option value="">Select Transaction Type</option>
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
                  {...register("desk", { required: "Desk is required" })}
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                {errors.remarks && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.remarks?.message}
                  </p>
                )}
              </div>

              <Button type="submit">
                {buttonLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="dots text-white "></div>
                  </div>
                ) : (
                  "Submit Transaction"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((transaction, index) => {
                  const date = new Date(transaction.createdAt);
                  const formattedDate = date.toLocaleDateString();
                  const formattedTime = date.toLocaleTimeString();

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="font-bold">
                          {transaction.transactionType} {transaction.points}{" "}
                          points
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.remarks}
                        </p>
                        <p className="text-sm text-gray-500">
                          Desk: {transaction.desk}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>
                            {formattedDate} {formattedTime}
                          </span>
                        </div>
                        <div className="flex  justify-end">
                          <div>
                            <p className="text-sm text-gray-500">
                              {transaction.transactionUsername}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientPointsManagement;
