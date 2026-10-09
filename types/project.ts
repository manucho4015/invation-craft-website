import studio from "../public/technology-studio.jpg";

export type Project = {
    title: string;
    heading: React.ReactNode;
    text: string;
    tags: string[];
    image: typeof studio;
    imageAlt: string;
    caption: string;
};