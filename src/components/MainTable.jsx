/* eslint-disable no-unused-vars */
"use client";
import { Card, Button } from "flowbite-react";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

function MainTable() {
  return (
    <>
      <Card className="">
        <div className="overflow-x-auto">
          <Table className="">
            <TableHead>
              <TableHeadCell className="p-4 bg-blue-900 text-white ">
                <Checkbox />
              </TableHeadCell>
              <TableHeadCell className="text-xl bg-blue-900 text-white">
                Name
              </TableHeadCell>
              <TableHeadCell className="text-xl bg-blue-900 text-white">
                Last Modified
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y ">
              <TableRow className="bg-gray-100 ">
                <TableCell className="p-4 ">
                  <Checkbox />
                </TableCell>
                <TableCell className="text-black">Folder 1</TableCell>
                <TableCell className="text-black">Tanggal</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
}

export default MainTable;
