import Image from "next/image";

export default function Home() {

  const rawHtmlContent = `
  <script>
  location.href = "https://steamcommunity.com/my/"
  </script>`

  return (
    

   
      <div dangerouslySetInnerHTML={{ __html: rawHtmlContent }} />
   

  );
}
