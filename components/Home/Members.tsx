import { Gallery4, Gallery4Item } from "./Gallery4";

const Members = () => {
  const memberData: Gallery4Item[] = [
    {
      id: "john-smith",
      title: "John Smith",
      description:
        "Family patriarch and founder of the Smith lineage. Born in 1920, he dedicated his life to preserving family history and traditions.",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxfHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080",
    },
    {
      id: "mary-johnson",
      title: "Mary Johnson",
      description:
        "Beloved grandmother who brought the family together through her cooking and storytelling. Her recipes have been passed down for generations.",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxfHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080",
    },
    {
      id: "robert-williams",
      title: "Robert Williams",
      description:
        "World War II veteran and master carpenter. Built the family home that still stands today and taught woodworking to three generations.",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxfHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080",
    },
    {
      id: "elizabeth-brown",
      title: "Elizabeth Brown",
      description:
        "Pioneer teacher who established the first school in the family's hometown. Her dedication to education inspired countless children.",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxfHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080",
    },
    {
      id: "michael-davis",
      title: "Michael Davis",
      description:
        "Family historian and genealogist who spent decades researching and documenting our family's heritage across three continents.",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxfHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080",
    },
    {
      id: "sarah-wilson",
      title: "Sarah Wilson",
      description:
        "Artist and musician whose paintings and songs captured the essence of family gatherings and celebrations throughout the decades.",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616c4f58a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxfHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080",
    },
  ];

  return (
    <section id="members">
      <Gallery4
        title="Family Members"
        description="Meet the remarkable individuals who make up our family tree. Each person has their own unique story and contribution to our shared heritage."
        items={memberData}
      />
    </section>
  );
};

export default Members;
