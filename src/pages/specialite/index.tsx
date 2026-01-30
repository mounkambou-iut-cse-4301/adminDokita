import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/components/ui/table";

import { Button } from "../../components/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/components/ui/card";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CalendarIcon,
  PlusCircle,
} from "lucide-react";
import { Input } from "../../components/components/ui/input";
import { CustomCheckbox } from "../../components/components/ui/customcheck";
import { CustomSwitch } from "../../components/components/ui/customswitch";
import React, { useEffect, useState } from "react";
import { FaEdit, FaSearch, FaTrash, FaUser } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import TMModal from "../../components/components/ui/TM_Modal";
import TotalLoad from "../../components/components/totalLoad";
import { Label } from "../../components/components/ui/label";

import Pagination from "../../components/components/ui/pagination";
import { useForm } from "react-hook-form";

import DetailOrdonnance from "./detailMessageStruct";
import useStoreAllSpecialite from "src/store/specialite/getAll";

type FilterFormValues = {
  createdAt?: Date;
};

export default function Specialite() {
  const form = useForm<FilterFormValues>({
    defaultValues: { createdAt: undefined },
  });
  const [isChecked, setIsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [detailCard, setDetailCard] = useState(false);

  const [idcartes, setIdcartes] = useState("");

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const { AllSpecialite, loadingAllSpecialite, fetchAllSpecialite, count } =
    useStoreAllSpecialite();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    fetchAllSpecialite({ page, limit: 5, q: debouncedSearch });
  }, [page, debouncedSearch, fetchAllSpecialite]);

  if (loadingAllSpecialite) {
    return <TotalLoad />;
  }
  console.log("AllSpecialite", AllSpecialite);

  return (
    <div className="flex flex-col p-4 h-full">
      <div className="flex justify-end">
        <div
          className="flex gap-2 items-center bg-primary p-2 rounded-full my-3 cursor-pointer  text-white"
          onClick={() => {
            navigate("/add_specialite");
          }}
        >
          <PlusCircle className="w-4 h-4" /> Ajouter une spécialité
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            <div className="flex items-center justify-between ">
              <div>
                <p className="text-lg">Nombre total de specialite</p>

                <p className="text-2xl font-bold">{count}</p>
              </div>
            </div>{" "}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col  gap-4  p-2">
          <div className="flex items-center justify-between border border-gray-200 p-1 ">
            <p className="text-sm text-muted-foreground">
              +140 ce dernier mois
            </p>

            <Button variant="outline" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-1 border border-gray-200 p-2 bg-white">
        <div className="relative flex gap-2 ">
          <input
            type="text"
            placeholder="Rechercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-1 rounded-md bg-white border border-gray-300 focus:outline-none"
          />
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
        </div>{" "}
      </div>

      <Table className="bg-white">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Nom de la spécialité</TableHead>
            <TableHead>Prix consultation</TableHead>
            <TableHead>Durée (min)</TableHead>
            <TableHead>Forfait mensuel</TableHead>
            <TableHead>Nombre de consultations</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {AllSpecialite?.map((s, i) => (
            <TableRow key={s.specialityId ?? i}>
              <TableCell>
                <CustomCheckbox
                  label=""
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
              </TableCell>

              <TableCell className="font-semibold">{s.name}</TableCell>

              <TableCell>{s.consultationPrice} FCFA</TableCell>

              <TableCell>{s.consultationDuration}</TableCell>

              <TableCell>{s.planMonthAmount} FCFA</TableCell>

              <TableCell>{s.numberOfTimePlanReservation}</TableCell>

              <TableCell>
                {new Date(s.createdAt).toLocaleDateString()}
              </TableCell>

              {/* Actions */}
              <TableCell>
                <Popover>
                  <PopoverTrigger className="bg-gray-200 px-4 py-1 rounded-md">
                    <MoreHorizontal className="w-4 h-4" />
                  </PopoverTrigger>

                  <PopoverContent className="p-4 w-full">
                    <ul className="space-y-2 cursor-pointer">
                      <li
                        className="flex items-center gap-2 p-2 border-b"
                        onClick={() => {
                          setDetailCard(true);
                          setIdcartes(String(s.specialityId));
                        }}
                      >
                        <FaEdit className="text-gray-600" />
                        <span>Détail</span>
                      </li>

                      <li
                        className="flex items-center gap-2 p-2"
                        onClick={() => setIsOpen(true)}
                      >
                        <FaTrash className="text-red-600" />
                        <span className="text-red-600">Supprimer</span>
                      </li>
                    </ul>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter className="bg-white">
          <TableRow>
            <TableCell colSpan={7}>
              <div className="flex justify-center my-4">
                <Pagination
                  pages={Math.ceil((count || 1) / 7)}
                  currentPage={page}
                  onPageChange={setPage}
                  rangeLimit={5}
                />
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Transition show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl">
              <Dialog.Title className="text-lg font-bold">
                {"admin.confirm_delete"}
              </Dialog.Title>
              <p className="mt-2">{"admin.confirm_delete_message"}</p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {"admin.cancel"}
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                  //  onClick={handleDeleteUser}
                  // disabled={loadingdeleteUsers}
                >
                  supprimer
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      <TMModal
        isOpen={detailCard}
        onClose={() => {
          setDetailCard(false);
          // window.location.reload();
        }}
        // title="Detail carte"
        size="md"
        height={70}
      >
        <DetailOrdonnance idcartes={idcartes} />
      </TMModal>
    </div>
  );
}
