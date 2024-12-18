import { Button } from "@/app/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/components/ui/drawer";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  CircleXIcon,
  ListPlusIcon,
  Loader2Icon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { useFetcher, useLoaderData } from "react-router";
import type { action } from "../../api.video-parser/route";
import type { loader } from "../route";
import { useSocket } from "../socket-context";
import { DEFAULT_PARSER_OUTPUT, type ParserOutput } from "./parser";

export function ImportVideoButton() {
  const { role } = useLoaderData<typeof loader>();

  const { data, state, submit } = useFetcher<typeof action>();

  const [videoUrl, setVideoUrl] = useState("");
  const [parserOutput, setParserOutput] = useState<ParserOutput>(
    DEFAULT_PARSER_OUTPUT,
  );

  // Call server action to parse video URL.
  useEffect(() => {
    if (!videoUrl) {
      setParserOutput(DEFAULT_PARSER_OUTPUT);
      return;
    }

    submit({ videoUrl }, { method: "POST", action: "/api/video-parser" });
  }, [submit, videoUrl]);

  // Populate parser output based on server action response.
  useEffect(() => {
    if (!data || "error" in data) {
      setParserOutput(DEFAULT_PARSER_OUTPUT);
      return;
    }

    setParserOutput(data);
  }, [data]);

  const socket = useSocket();
  const [isImporting, setIsImporting] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const importVideo = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!socket) {
      return;
    }

    const { html, provider, title } = parserOutput;

    setIsImporting(true);
    await socket.emitWithAck("playlist:import", {
      url: videoUrl,
      provider,
      title,
      html,
    });
    setVideoUrl("");
    setIsImporting(false);
    setIsDrawerOpen(false);
  };

  if (role === "visitor") {
    return null;
  }

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7">
          <PlusIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full max-w-sm mx-auto">
          <DrawerHeader>
            <DrawerTitle>Import a Video</DrawerTitle>
            <DrawerDescription>Paste the URL of the video.</DrawerDescription>
          </DrawerHeader>
          <form className="px-4">
            <div className="space-y-1">
              <Label htmlFor="videoUrl" required>
                Video URL
              </Label>
              <Input
                type="url"
                name="videoUrl"
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.currentTarget.value)}
                placeholder="https://"
                required
                id="videoUrl"
              />
            </div>
          </form>
          {!videoUrl ? null : state === "submitting" ? (
            <div className="grid place-items-center h-[260px] rounded-md border mx-4 mt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2Icon className="size-4 animate-spin" />
                Parsing
              </div>
            </div>
          ) : !data ? null : "error" in data ? (
            <div className="grid place-items-center h-[260px] rounded-md border mx-4 mt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CircleXIcon className="size-4" />
                Unsupported platform
              </div>
            </div>
          ) : (
            <div className="rounded-md border mx-4 mt-4 overflow-hidden">
              <img
                src={parserOutput.thumbnailUrl}
                alt="Thumbnail of the video to be imported"
                width={352}
                className="aspect-video bg-muted object-cover"
              />
              <p className="px-3 py-2 text-sm font-medium">
                {parserOutput.title}
              </p>
            </div>
          )}
          <DrawerFooter>
            <Button
              disabled={
                parserOutput.provider === "" ||
                state === "submitting" ||
                isImporting
              }
              onClick={importVideo}
            >
              {isImporting ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <ListPlusIcon />
              )}
              Import
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">
                <XIcon />
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
