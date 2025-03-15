"use client"
import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { FileUp, Users, Trophy, Table as TableIcon, List } from "lucide-react";

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [pairs, setPairs] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setPlayers(sheet);
    };
    reader.readAsArrayBuffer(file);
  };

  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };
  
  const pairPlayers = () => {
    let under30 = shuffleArray(players.filter(p => p.Age < 30));
    let over50 = shuffleArray(players.filter(p => p.Age > 50));
    let others = shuffleArray(players.filter(p => p.Age >= 30 && p.Age <= 50));
  
    let pairs = [];
  
    // Pair under 30 with over 50 first
    while (under30.length > 0 && over50.length > 0) {
      pairs.push([under30.shift(), over50.shift()]);
    }
  
    // Shuffle remaining players to introduce randomness
    let remainingPlayers = shuffleArray([...under30, ...over50, ...others]);
  
    // Pair remaining players
    while (remainingPlayers.length > 1) {
      pairs.push([remainingPlayers.shift(), remainingPlayers.pop()]);
    }
  
    setPairs(pairs);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Trophy className="w-10 h-10" /> JB Badminton Pairing System
        </h1>
      </header>

      <div className="flex flex-col items-center space-y-6">
        <Card className="p-6 shadow-lg w-full max-w-lg">
          <CardContent className="flex flex-col items-center space-y-4">
            <label className="cursor-pointer bg-gray-100 p-4 rounded-lg shadow-md flex items-center gap-2 text-lg font-semibold">
              <FileUp className="w-6 h-6" />
              <span>Select File</span>
              <input
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <Button
              onClick={pairPlayers}
              className="flex items-center gap-2 text-lg px-6 py-3"
            >
              <Users className="w-6 h-6" /> Pair Players
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
            <List className="w-6 h-6" /> Player List
          </h2>
          {players.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="border border-gray-200 rounded-lg">
                {/* <TableHead>
                  <TableRow className="bg-gray-200">
                    <TableCell className="font-bold">Name</TableCell>
                    <TableCell className="font-bold">Age</TableCell>
                    <TableCell className="font-bold">Rating</TableCell>
                  </TableRow>
                </TableHead> */}
                <TableBody>
                  {players.map((player, index) => (
                    <TableRow
                      key={index}
                      className="border-b hover:bg-gray-100"
                    >
                      <TableCell>{player.Name}</TableCell>
                      <TableCell>{player.Age}</TableCell>
                      {/* <TableCell>{player.Rating}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No Records available</p>
          )}
        </CardContent>
      </Card>

      {pairs.length > 0 && (
        <Card className="p-6 shadow-lg">
          <CardContent>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <TableIcon className="w-6 h-6" /> Player Pairs
            </h2>
            <div className="overflow-x-auto">
  <Table className="border border-gray-200 rounded-lg w-full">
    {/* <TableHead>
      <TableRow className="bg-gray-200">
        <TableCell className="font-bold text-center">#</TableCell>
        <TableCell className="font-bold text-left">Player 1</TableCell>
        <TableCell className="font-bold text-center">Age</TableCell>
        <TableCell className="font-bold text-left">Player 2</TableCell>
        <TableCell className="font-bold text-center">Age</TableCell>
      </TableRow>
    </TableHead> */}
    <TableBody>
      {pairs.map((pair, index) => (
        <TableRow key={index} className="border-b hover:bg-gray-100">
          <TableCell className="text-center">{index + 1}</TableCell>
          <TableCell className="text-left">{pair[0]?.Name}</TableCell>
          <TableCell className="text-center">{pair[0]?.Age}</TableCell>
          <TableCell className="text-left">{pair[1]?.Name}</TableCell>
          <TableCell className="text-center">{pair[1]?.Age}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>

          </CardContent>
        </Card>
      )}

      <footer className="text-center p-6 bg-gray-100 rounded-lg shadow-md">
        <p className="text-lg">
          &copy; {new Date().getFullYear()} Badminton Pairing System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
