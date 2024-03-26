import Home from "@/components/UI/Home";

export function generateStaticParams() {
  return [{date:'20240326'}]
}
  
export default function TableMain() {

  return (
    <>
      <Home/>
    </>
  );
}
