export  interface Section {
  id?: string;
  order: number;
  page: string;
  location: string;
  component: string;

  isActive: boolean,

  sectionTitle: string;
  titleFontStyle?: string;
  titleFontSize?: number;
  titleColor: any;

  sectionSubTitle?: string;
  subtitleColor: any;
  subtitleFontSize?: number;
  subtitleFontStyle?: string;

  textFontSize?: number;
  textFontStyle?: string;
  // contentFontWeight?: string;
  // contentLineHeight?: number;
  // contentTextAlign?: string;
  // contentTextTransform?: string;
  // contentTextDecoration?: string;
  // contentTextIndent?: number;

  alignText:string;
  textColor: any;
  sectionContent?: string;

  items?: any[];

  showButton?: boolean;
  buttonText: string;
  buttonLink: string;

  sectionImageUrl?: string;
  showImage?:string;

  isMinimal:boolean;
  isParallax:boolean;
  fullWidth: boolean,
  backgroundColor: any;
  boxShadow:boolean;
  borderRadius:number;
  paddingTop: number,
paddingBottom: number,
paddingLeft: number,
paddingRight: number,
contentPadding:number,
}
