import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2Icon, UsersRoundIcon, XIcon } from "lucide-react";
import { useFetcher } from "react-router";

export function JoinRoomButton() {
  const { Form, state } = useFetcher();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UsersRoundIcon />
          Join room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Other&apos;s Room</DialogTitle>
          <DialogDescription>
            Paste the link that your friend has shared with you.
          </DialogDescription>
        </DialogHeader>
        <Form method="POST" action="/room/join" id="join-room">
          <label htmlFor="room" className="sr-only">
            Room link
          </label>
          <Input
            type="url"
            name="room"
            placeholder="https://cinema.mrcai.dev/room/..."
            required
            id="room"
          />
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <XIcon />
              Cancel
            </Button>
          </DialogClose>
          <Button form="join-room" disabled={state === "submitting"}>
            {state === "submitting" ? <Loader2Icon /> : <UsersRoundIcon />}
            Join
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
