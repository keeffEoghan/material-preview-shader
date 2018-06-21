# Material Preview - Shader

Simulating real-world colours on-screen, by transforming the colour-space (for use with colour meter readings)

[Encoding 16 and 32 bit floating point values in an RGBA texture](http://www.gamedev.net/topic/486847-encoding-16-and-32-bit-floating-point-value-into-rgba-byte-texture/)

```glsl
FloatToInt()
const float toFixed = 255.0 / 256.0;
out.r = frac(floatValue * toFixed * 1.0);
out.g = frac(floatValue * toFixed * 255.0);
out.b = frac(floatValue * toFixed * 255.0 * 255.0);
out.a = frac(floatValue * toFixed * 255.0 * 255.0 * 255.0);

IntToFloat()
const float fromFixed = 256.0 / 255.0;
in = intValue.r * fromFixed / 1.0
    +intValue.g * fromFixed / (255.0)
    +intValue.b * fromFixed / (255.0 * 255.0)
    +intValue.a * fromFixed / (255.0 * 255.0 * 255.0);
```

- [Demo](https://keeffeoghan.github.io/material-preview-shader)
