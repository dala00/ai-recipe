import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react'

type Props = {
  value: number
  onChange: (value: number) => void
}

export default function StatusSlider(props: Props) {
  return (
    <Slider
      aria-label="slider-ex-1"
      value={props.value}
      onChange={props.onChange}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  )
}
