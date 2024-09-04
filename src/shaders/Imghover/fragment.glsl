uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

varying vec2 vUv;
uniform float hoverState;

void main()
{
    vec2 p = vUv;

    // Parameters for the wave distortion
    float waveFrequency = 15.0;
    float waveAmplitude = 0.05 * sin(hoverState * 3.14159265); // Sinusoidal function for distortion strength
    float time = hoverState * 5.0;

    // Apply wave distortion to UV coordinates with varying amplitude
    vec2 waveDistortion = p + vec2(
        sin(p.y * waveFrequency + time) * waveAmplitude,
        cos(p.x * waveFrequency + time) * waveAmplitude
    );

    // Apply glitch effect with varying intensity
    vec2 glitchDistortion = waveDistortion + vec2(
        (fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.05 * sin(hoverState * 3.14159265),
        (fract(sin(dot(p, vec2(93.9898, 67.233))) * 12345.6789) - 0.5) * 0.05 * sin(hoverState * 3.14159265)
    );

    // Clamp the distorted UVs
    glitchDistortion = clamp(glitchDistortion, 0.0, 1.0);

    // Fetch textures with the distorted UVs
    vec4 tex1 = texture2D(uTexture1, glitchDistortion);
    vec4 tex2 = texture2D(uTexture2, glitchDistortion);

    // Smooth transition between the two textures
    float x = smoothstep(0.0, 1.0, hoverState);
    vec4 color = mix(tex1, tex2, x);

    // Ensure the image is clear at the beginning and end by reducing distortion
    color = mix(color, mix(texture2D(uTexture1, p), texture2D(uTexture2, p), x), 1.0 - sin(hoverState * 3.14159265));

    gl_FragColor = color;
}








