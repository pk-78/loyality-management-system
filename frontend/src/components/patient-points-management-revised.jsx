import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, PlusCircle, MinusCircle, Clock, User } from 'lucide-react';

const PatientPointsManagement = () => {
  // Mock patient data
  const patient = {
    name: "John Doe",
    uhid: "UHID123456",
    loyaltyCardNumber: "LOYAL9876543"
  };

  const [points, setPoints] = useState(500);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState('add');
  const [remarks, setRemarks] = useState('');
  const [desk, setDesk] = useState('');
  const [transactions, setTransactions] = useState([
    { date: '2024-09-23', type: 'Add', amount: 100, remarks: 'Welcome bonus', desk: 'Front Desk' },
    { date: '2024-09-24', type: 'Deduct', amount: 50, remarks: 'Redeemed for discount', desk: 'Billing Desk' },
  ]);

  const handleTransaction = () => {
    const amount = parseInt(transactionAmount);
    if (isNaN(amount) || amount <= 0 || !desk) return;

    const newPoints = transactionType === 'add' ? points + amount : points - amount;
    setPoints(newPoints);

    const newTransaction = {
      date: new Date().toISOString().split('T')[0],
      type: transactionType === 'add' ? 'Add' : 'Deduct',
      amount: amount,
      remarks: remarks,
      desk: desk
    };

    setTransactions([newTransaction, ...transactions]);
    setTransactionAmount('');
    setRemarks('');
    setDesk('');
  };

  return (
    <div className="p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <User className="h-6 w-6" />
            <div>
              <p className="font-bold text-lg">{patient.name}</p>
              <p className="text-sm text-gray-500">UHID: {patient.uhid}</p>
              <p className="text-sm text-gray-500 flex items-center">
                <CreditCard className="h-4 w-4 mr-1" /> 
                Loyalty Card: {patient.loyaltyCardNumber}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <CreditCard className="mr-2 h-6 w-6" />
              <span className="text-4xl font-bold">{points}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Add/Deduct Points</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="transactionAmount">Points</Label>
                <Input
                  id="transactionAmount"
                  type="number"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  placeholder="Enter points"
                />
              </div>
              <div>
                <Label htmlFor="transactionType">Transaction Type</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={() => setTransactionType('add')}
                    variant={transactionType === 'add' ? 'default' : 'outline'}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setTransactionType('deduct')}
                    variant={transactionType === 'deduct' ? 'default' : 'outline'}
                  >
                    <MinusCircle className="mr-2 h-4 w-4" /> Deduct
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="desk">Desk</Label>
                <Select onValueChange={setDesk} value={desk}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select desk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Front Desk">Front Desk</SelectItem>
                    <SelectItem value="Billing Desk">Billing Desk</SelectItem>
                    <SelectItem value="Pharmacy Desk">Pharmacy Desk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Input
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks"
                />
              </div>
              <Button onClick={handleTransaction} className="w-full">
                Submit Transaction
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
          <div className="space-y-2">
            {transactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-bold">{transaction.type} {transaction.amount} points</p>
                  <p className="text-sm text-gray-500">{transaction.remarks}</p>
                  <p className="text-sm text-gray-500">Desk: {transaction.desk}</p>
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
