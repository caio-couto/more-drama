import Advertising from "@/components/Advertising";
import NovelCard from "@/components/NovelCard";
import NovelEpisodes from "@/components/NovelEpisodes";
import NovelResume from "@/components/NovelResume";

export default function Novel() {
  return (
    <>
    <Advertising/>
    <div className="my-10">
      <NovelCard/>
      <div className="mx-4 mb-5">
        <div className="max-w-fit rounded mb-4 py-2 px-4 font-semibold bg-primary">Episódios</div>
        <NovelEpisodes/>
      </div>
      <NovelResume>
        A série &quot;Não Desafie a Senhora Bilionária&quot; gira 
        em torno de uma protagonista empoderada, audaciosa e 
        dona de um império bilionário, que enfrenta desafios 
        tanto em sua vida pessoal quanto no mundo dos negócios.
        <br/>
        <br/>
        Após um passado difícil, ela constrói sua fortuna do 
        zero, tornando-se uma figura imponente e influente. 
        A história ganha intensidade quando ela cruza caminhos 
        com um homem igualmente teimoso e intrigante, cuja 
        visão de mundo muitas vezes entra em conflito com a dela.
        <br/>
        <br/>
        Entre negociações intensas, segredos revelados e uma 
        forte tensão emocional, os dois personagens embarcam 
        em um relacionamento que desafia suas convicções, 
        testando os limites do poder, do orgulho e do amor.
        <br/>
        <br/>
        Com temas como superação, intrigas empresariais, romance 
        arrebatador e reviravoltas dramáticas, a série cativa o 
        leitor ao explorar a força feminina em um ambiente muitas 
        vezes dominado por homens, enquanto aborda as vulnerabilidades 
        escondidas sob a fachada de uma bilionária inabalável.
      </NovelResume>
      <NovelResume>
        <div className="max-w-fit rounded mb-4 py-2 px-4 font-semibold bg-primary">Episódios</div>
        A série &quot;Não Desafie a Senhora Bilionária&quot; gira 
        em torno de uma protagonista empoderada, audaciosa e 
        dona de um império bilionário, que enfrenta desafios 
        tanto em sua vida pessoal quanto no mundo dos negócios.
        <br/>
        <br/>
        Após um passado difícil, ela constrói sua fortuna do 
        zero, tornando-se uma figura imponente e influente. 
        A história ganha intensidade quando ela cruza caminhos 
        com um homem igualmente teimoso e intrigante, cuja 
        visão de mundo muitas vezes entra em conflito com a dela.
        <br/>
        <br/>
        Entre negociações intensas, segredos revelados e uma 
        forte tensão emocional, os dois personagens embarcam 
        em um relacionamento que desafia suas convicções, 
        testando os limites do poder, do orgulho e do amor.
        <br/>
        <br/>
        Com temas como superação, intrigas empresariais, romance 
        arrebatador e reviravoltas dramáticas, a série cativa o 
        leitor ao explorar a força feminina em um ambiente muitas 
        vezes dominado por homens, enquanto aborda as vulnerabilidades 
        escondidas sob a fachada de uma bilionária inabalável.
      </NovelResume>
    </div>
    </>
  );
}
