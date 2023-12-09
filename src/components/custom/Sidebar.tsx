import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import ColorBlocks from "./ColorBlocks";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  setFontType,
  setShapeFillColor,
  setSketchBookBackgroundColor,
  setStrokeColor,
  setStrokeWidth,
} from "@/redux/toolkitSlice";
import {
  CANVAS_BG_COLOR_CODE,
  FONT_TYPE,
  IMAGE_EXPORT_FORMAT,
  STROKE_LINE_STYLE,
  STROKE_STYLE_COLOR_CODE,
} from "@/constants/constants";
import {
  IExportData,
  IFontType,
  ILineStroke,
} from "@/helper/interface/interface";
import LineStrokeBlock from "./LineStrokeBlock";
import { toast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import exportCanvasData from "@/helper/functions/exportCanvasData";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const {
    strokeColor,
    sketchBookBackground,
    strokeWidth,
    currentShape,
    shapeFillColor,
    fontType,
  } = useAppSelector((state) => state.toolkit);
  const { canvas } = useAppSelector((state) => state.canvas);

  // for filename and filetype data
  const [exportData, setExportData] = useState<IExportData>({
    fileName: "canvas_artwork",
    fileType: "image/png",
  });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild className="absolute left-5 top-5">
        <Button variant="outline" size={"sm"} className="hover:bg-mainTertiary">
          <i className="fa-solid fa-bars" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="w-72 overflow-y-scroll">
        <div className="space-y-5">
          {/* for stroke color */}
          <div className="space-y-1">
            <p className="text-xs font-medium">
              {currentShape === "text" ? "Font color" : "Stroke color"}
            </p>
            <div className="flex items-center justify-between">
              {STROKE_STYLE_COLOR_CODE &&
                STROKE_STYLE_COLOR_CODE.map((color) => {
                  return (
                    <ColorBlocks
                      key={uuidv4()}
                      colorCode={color}
                      type="stroke"
                    />
                  );
                })}

              <Separator orientation="vertical" className="h-5" />

              {/* color picker */}
              <div
                tabIndex={0}
                className="rounded-[8px] border-[1px] border-mainPrimary w-fit cursor-pointer"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="cursor-pointer">
                        <div
                          style={{ backgroundColor: strokeColor }}
                          className="w-5 h-5 rounded-[6px] m-[2px]"
                        ></div>
                        <Input
                          type="color"
                          className="hidden"
                          onChange={(event) => {
                            if (currentShape === "eraser") {
                              toast({
                                description:
                                  "Feature disabled while using eraser",
                              });
                              return;
                            }
                            dispatch(setStrokeColor(event.target.value));
                          }}
                        />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choose custom color</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* for stroke width */}
          <div className="space-y-1">
            <p className="text-xs font-medium">
              {currentShape === "eraser"
                ? "Eraser size"
                : currentShape === "text"
                ? "Font size"
                : "Stroke width"}
            </p>
            <div>
              <Input
                type="range"
                min={currentShape === "text" ? 16 : 1}
                max={
                  currentShape === "eraser"
                    ? 100
                    : currentShape === "text"
                    ? 50
                    : 20
                }
                className="h-4"
                value={strokeWidth}
                onChange={(event) => {
                  dispatch(setStrokeWidth(Number(event.target.value)));
                }}
              />
            </div>
          </div>

          {/* for font type */}
          {currentShape === "text" && (
            <div>
              <Label>
                <p className="mb-2 text-xs">Font type</p>
                <Select
                  value={fontType}
                  onValueChange={(value) => dispatch(setFontType(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fonts</SelectLabel>
                      {FONT_TYPE &&
                        FONT_TYPE.map((font: IFontType) => {
                          return (
                            <SelectItem key={uuidv4()} value={font.value}>
                              {font.name}
                            </SelectItem>
                          );
                        })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Label>
            </div>
          )}

          {/* for stroke style */}
          {currentShape !== "text" && (
            <div className="space-y-1">
              <p className="text-xs font-medium">Stroke style</p>
              <div className="flex items-center gap-2">
                {STROKE_LINE_STYLE &&
                  STROKE_LINE_STYLE.map((stroke: ILineStroke) => {
                    return <LineStrokeBlock key={uuidv4()} data={stroke} />;
                  })}
              </div>
            </div>
          )}

          {/* for shape fill color */}
          {(currentShape === "square" || currentShape === "circle") && (
            <div className="space-y-1">
              <p className="text-xs font-medium">Shape fill color</p>
              <div className="flex items-center justify-between">
                {CANVAS_BG_COLOR_CODE &&
                  CANVAS_BG_COLOR_CODE.map((color) => {
                    return (
                      <ColorBlocks
                        key={uuidv4()}
                        colorCode={color}
                        type="shapeFill"
                      />
                    );
                  })}

                <Separator orientation="vertical" className="h-5" />

                {/* color picker */}
                <div
                  tabIndex={0}
                  className="rounded-[8px] border-[1px] border-mainPrimary w-fit cursor-pointer"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="cursor-pointer">
                          <div
                            style={{ backgroundColor: shapeFillColor }}
                            className="w-5 h-5 rounded-[6px] m-[2px]"
                          ></div>
                          <Input
                            type="color"
                            className="hidden"
                            onChange={(event) =>
                              dispatch(setShapeFillColor(event.target.value))
                            }
                          />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Choose custom color</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          )}

          {/* for canvas background color */}
          <div className="space-y-1">
            <p className="text-xs font-medium">Sketch book background</p>
            <div className="flex items-center justify-between">
              {CANVAS_BG_COLOR_CODE &&
                CANVAS_BG_COLOR_CODE.map((color) => {
                  return (
                    <ColorBlocks
                      key={uuidv4()}
                      colorCode={color}
                      type="canvas"
                    />
                  );
                })}

              <Separator orientation="vertical" className="h-5" />

              {/* color picker */}
              <div
                tabIndex={0}
                className="rounded-[8px] border-[1px] border-mainPrimary w-fit cursor-pointer"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="cursor-pointer">
                        <div
                          style={{ backgroundColor: sketchBookBackground }}
                          className="w-5 h-5 rounded-[6px] m-[2px]"
                        ></div>
                        <Input
                          type="color"
                          className="hidden"
                          onChange={(event) => {
                            if (currentShape === "eraser") {
                              toast({
                                description:
                                  "Feature disabled while using eraser",
                              });
                              return;
                            }
                            dispatch(
                              setSketchBookBackgroundColor(event.target.value)
                            );
                          }}
                        />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choose custom color</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          <Separator orientation="horizontal" />

          {/* for extra option */}
          <div className="space-y-2">
            {/* export sketch */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger className="w-full">
                <Button
                  variant={"outline"}
                  className="hover:bg-mainSecondary w-full flex items-center justify-start gap-2"
                >
                  <i className="fa-solid fa-download" /> <p>Export sketch</p>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="space-y-5">
                  <DialogTitle>Export your artwork</DialogTitle>
                  <DialogDescription className="flex flex-col gap-5">
                    {/* for file name */}
                    <Label>
                      File name
                      <Input
                        type="text"
                        className="mt-2"
                        value={exportData?.fileName}
                        placeholder="File name"
                        onChange={(event) =>
                          setExportData({
                            ...exportData,
                            fileName: event?.target?.value,
                          })
                        }
                      />
                    </Label>

                    {/* for file type */}
                    <Label>
                      <p className="mb-2">File type</p>
                      <Select
                        value={exportData?.fileType}
                        onValueChange={(value) =>
                          setExportData({ ...exportData, fileType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose file type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>File types</SelectLabel>
                            {IMAGE_EXPORT_FORMAT &&
                              IMAGE_EXPORT_FORMAT.map((file: IExportData) => {
                                return (
                                  <SelectItem
                                    key={uuidv4()}
                                    value={file?.fileType}
                                  >
                                    {file?.fileName}
                                  </SelectItem>
                                );
                              })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Label>
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      disabled={!exportData?.fileName || !exportData?.fileType}
                      className="w-full"
                      onClick={() => {
                        exportCanvasData(
                          canvas,
                          exportData?.fileName,
                          exportData?.fileType
                        );
                        setIsOpen(false);
                        setExportData(IMAGE_EXPORT_FORMAT[0]);
                      }}
                    >
                      Export
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {/* live collaboration */}
            <Button
              variant={"outline"}
              className="hover:bg-mainSecondary w-full flex items-center justify-start gap-2"
            >
              <i className="fa-solid fa-user-group" />
              <p>Live collaboration</p>
            </Button>

            {/* reset canvas */}
            <Button
              variant={"outline"}
              className="hover:bg-mainSecondary w-full flex items-center justify-start gap-2"
            >
              <i className="fa-solid fa-trash" />
              <p>Reset the canvas</p>
            </Button>
          </div>

          <Separator />

          {/* for social media options */}
          <div className="space-y-2">
            <Button
              variant={"outline"}
              className="hover:bg-mainSecondary w-full flex items-center justify-start gap-2"
            >
              <i className="fa-brands fa-github" />
              <p>Github</p>
            </Button>
            <Button
              variant={"outline"}
              className="hover:bg-mainSecondary w-full flex items-center justify-start gap-2"
            >
              <i className="fa-brands fa-linkedin" />
              <p>Linkedin</p>
            </Button>
            <Button
              variant={"outline"}
              className="hover:bg-mainSecondary w-full flex items-center justify-start gap-2"
            >
              <i className="fa-solid fa-bug" />
              <p>Report a bug</p>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
