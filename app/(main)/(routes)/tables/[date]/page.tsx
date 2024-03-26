import Home from "@/components/UI/home";

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
