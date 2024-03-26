import Home from "@/components/UI/Home";

export function generateStaticParams(str: any) {
  console.log('generateStaticParams:', str);
  const date = new Date();
    const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2,'0')}`;
  return [{date:today}];
}

export default function TableMain() {

  return (
    <>
      <Home/>
    </>
  );
}
