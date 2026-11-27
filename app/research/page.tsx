export const metadata = { title: "Research" };

export default function Research() {
  return (
    <main className="section shell" id="research">
      <h1 className="portal-title">Research</h1>
      <article aria-labelledby="resnet-anisotropy">
        <h2 id="resnet-anisotropy">
          Depth-Associated Late-Stage Representational Anisotropy in Pretrained ResNets
        </h2>
        <p>
          Across 100 Tiny ImageNet class pairs, this study uses the participation ratio to
          track how many directions account for the variance in feature representations
          at each residual block of five pretrained ResNets. From the end of Layer 3 to
          the end of Layer 4, the average participation ratio increased in ResNet-18 and
          ResNet-34 and fell in ResNet-50, ResNet-101, and ResNet-152, indicating more
          concentrated variance at the final block in the three deeper models.
        </p>
        <p>
          <a
            href="https://github.com/Lawson-Dong/Depth-Associated-Late-Stage-Representational-Anisotropy-in-Pretrained-ResNets"
            target="_blank"
            rel="noopener noreferrer"
          >
            View code and results on GitHub
          </a>
        </p>
      </article>
    </main>
  );
}
