import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/components/ui/table";
import { Badge } from "../../components/components/ui/badge";
import { Switch } from "../../components/components/ui/switch";
import { Button } from "../../components/components/ui/button";
import { Checkbox } from "../../components/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
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
import DetailAbonnement from "./detailMessageStruct";
import TMModal from "../../components/components/ui/TM_Modal";
import DetailRendez from "./detailMessageStruct";
import DetailMessage from "./detailMessageStruct";
import TotalLoad from "../../components/components/totalLoad";
import { Label } from "../../components/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/components/ui/select";
import dayjs from "dayjs";
import Pagination from "../../components/components/ui/pagination";
import useStoreCategoriesVid from "src/store/categorieVideo/getAll";

export default function CategorieVideo() {
  const [isChecked, setIsChecked] = useState(false);
  const [isSwitched, setIsSwitched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [detailCard, setDetailCard] = useState(false);

  const [adresse, setAdresse] = useState("");
  const [date, setDate] = useState("");
  const [statut, setStatut] = useState("");

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { CategoriesVid, loadingCategoriesVid, fetchCategoriesVid, count } =
    useStoreCategoriesVid();

  const handleSearch = (e: string) => {
    setSearch(e);
    setPage(1);
  };

  useEffect(() => {
    fetchCategoriesVid({ page, limit: 7 });
  }, [page, fetchCategoriesVid]);

  if (loadingCategoriesVid) {
    return <TotalLoad />;
  }

  console.log("CategoriesVid", CategoriesVid);

  return (
    <div className="flex flex-col p-4 h-full">
      <div className="flex justify-end">
        <div
          className="flex gap-2 items-center bg-primary p-2 rounded-full my-3 cursor-pointer  text-white"
          onClick={() => {
            navigate("/add_categorieVideo");
          }}
        >
          <PlusCircle className="w-4 h-4" /> Ajouter une Catégorie
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            <div className="flex items-center justify-between ">
              <div>
                <p className="text-lg">Nombre total de Catégorie </p>

                <p className="text-2xl font-bold">
                  {count}
                  {/*                   <span className="text-green-500 text-sm ml-1">+5.2%</span>
                   */}{" "}
                </p>
              </div>
            </div>{" "}
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="flex items-center justify-between mb-1 border border-gray-200 p-2 bg-white">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher"
            className="pl-10 pr-4 py-1 rounded-md bg-white border border-gray-300 focus:outline-none"
          />
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
        </div>{" "}
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <img
              src="/Iconfleche.svg"
              // alt="Avatar"
              className="h-6 w-6 rounded-full"
            />
          </Button>

          {/*    <Button variant="outline" size="sm">
              <img
                src="/iconFil.svg"
                // alt="Avatar"
                className="h-6 w-6 rounded-full"
              />{" "}
            </Button> */}

          <Popover>
            <PopoverTrigger className=" bg-white text-left px-4 py-1 text-sm  border rounded-md hover:bg-gray-100">
              <img
                src="/iconFil.svg"
                // alt="Avatar"
                className="h-6 w-6 rounded-full"
              />{" "}
            </PopoverTrigger>
            <PopoverContent className="">
              <div className="p-4 space-y-4">
                <h2 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Filtre
                </h2>

                {/* Adresse */}
                <div className="space-y-1">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Select value={adresse} onValueChange={setAdresse}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une adresse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adresse1">Adresse 1</SelectItem>
                      <SelectItem value="adresse2">Adresse 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    id="date"
                  />
                </div>

                {/* Statut */}
                <div className="space-y-1">
                  <Label htmlFor="statut">Statut</Label>
                  <Select value={statut} onValueChange={setStatut}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="valide">Validé</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="rejeté">Rejeté</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Boutons */}
                <div className="flex justify-between pt-2 ">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAdresse("");
                      setDate("");
                      setStatut("");
                    }}
                    className="rounded-full"
                  >
                    Réinitialiser
                  </Button>
                  <Button className="bg-[#1d3557] hover:bg-[#16314e] rounded-full text-white">
                    Appliquer
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Table className="bg-white">
        <TableHeader>
          <TableRow>
            <TableHead>
              <CustomCheckbox
                label=""
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />{" "}
            </TableHead>
            <TableHead>Nom de Catégories</TableHead>
            <TableHead>description</TableHead>
            <TableHead>Date de creation</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {CategoriesVid?.map((a, i) => (
            <TableRow
              key={i}
              //  className="cursor-pointer"
              onClick={() => {
                //  navigate("/detail_patient");
              }}
            >
              <TableCell>
                <CustomCheckbox
                  label=""
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />{" "}
              </TableCell>
              <TableCell className="flex items-center gap-2">
                {a.name}
              </TableCell>
              <TableCell className="text-blue-600">{a.description}</TableCell>
              <TableCell>
                {" "}
                {dayjs(a.createdAt).format("DD/MM/YYYY HH:mm")}
              </TableCell>

              <TableCell onClick={(e) => e.stopPropagation()}>
                <Popover>
                  <PopoverTrigger className=" bg-gray-200 text-left px-4 py-1 text-sm  border rounded-md hover:bg-gray-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </PopoverTrigger>
                  <PopoverContent className="p-4 w-full">
                    <ul className="space-y-2 cursor-pointer">
                      <li
                        className="flex items-center gap-2 p-2 border-b last:border-none"
                        onClick={(event) => {
                          event.stopPropagation();
                          setDetailCard(true);

                          //  handleRowClick(item.id);
                        }}
                        // navigate(0);
                      >
                        <FaEdit
                          className="text-gray-600 text-lg cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            setDetailCard(true);

                            //  handleRowClick(item.id);
                          }}
                        />
                        <span className="font-medium text-gray-500 text-sm hover:text-gray-600 transition-colors duration-200">
                          Detail
                        </span>
                      </li>

                      <li
                        className="flex items-center gap-2 p-2 border-b last:border-none"
                        onClick={(event) => {
                          event.stopPropagation();

                          // setSelectedUser(item.id);
                          setIsOpen(true);
                        }}
                        // navigate(0);
                      >
                        <FaTrash className="text-red-600 text-lg cursor-pointer" />
                        <span className="font-medium text-red-500 text-sm hover:text-red-600 transition-colors duration-200">
                          supprimer
                        </span>
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
                  {/*  {loadingdeleteUsers ? t("admin.deleting") : t("admin.delete")} */}{" "}
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
        <DetailMessage
        /*   idcartes={idCarte}
          descriptions={descriptions}
          nomCart={nomCart} */
        />
      </TMModal>
    </div>
  );
}
