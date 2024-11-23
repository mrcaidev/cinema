import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((count) => count + 1);

  return <Button onClick={increment}>Count: {count}</Button>;
}
