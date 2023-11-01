export interface SliderImage {
  url: string;
}

export interface Slider {
  name: string;
  images: SliderImage[];
}

export interface SliderData {
  sliderImages: Slider[];
}
