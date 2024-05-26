import { Link } from "react-router-dom";
import { useConfig } from "shared/config";

interface Config {
  remote: string;
}

export default function Test() {
  const config = useConfig<Config>();
  return (
    <div>
      <Link to="/local">Back</Link> {config.remote}
    </div>
  );
}

Test.displayName = "Test";
