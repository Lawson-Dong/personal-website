import Link from 'next/link';
import './measuring-tools.css';

export const metadata = {
  title: 'The measuring tools — Lawson Dong',
  description: 'A short introduction to Adjacent Linear CKA and how it tracks representation structure between consecutive neural-network layers.',
};

export default function MeasuringTools() {
  return <main className="shell measuring-tools">
    <Link className="text-link" href="/#research">Back to Research</Link>
    <header className="tools-intro">
      <p className="eyebrow">REPRESENTATION ANALYSIS / METHODS</p>
      <h1>The measuring tools</h1>
      <p>A few notes on how we measure changes in neural representations.</p>
    </header>
    <article aria-labelledby="cka-title">
      <p className="eyebrow">01 / REPRESENTATION SIMILARITY</p>
      <h2 id="cka-title">Adjacent Linear CKA</h2>
      <p><strong>How much of the representation structure is preserved from one layer to the next?</strong></p>
      <p>CKA stands for Centered Kernel Alignment. Linear CKA compares the pattern of similarities between the same inputs at two layers, even when those layers have different numbers of features.</p>
      <p>“Adjacent” simply means we compare consecutive layers: L₁ with L₂, L₂ with L₃, and so on.</p>
      <div className="tools-reading">
        <div><h3>Closer to 1</h3><p>The layers have more similar representation structure.</p></div>
        <div><h3>Closer to 0</h3><p>The layers have less similar representation structure.</p></div>
      </div>
      <p>In our geometric-dynamics experiments, a sharp drop in adjacent CKA highlights a layer transition worth inspecting for substantial geometric restructuring. It does not, by itself, establish a phase transition.</p>
      <details><summary>The formula, briefly</summary>
        <p>Let X and Y contain the same samples in the same order, with one sample per row. Subtract each feature’s mean across samples before calculating:</p>
        <div className="tools-formula" role="math" aria-label="CKA of X and Y equals the squared Frobenius norm of X transpose Y divided by the product of the Frobenius norms of X transpose X and Y transpose Y">CKA(X, Y) = ‖XᵀY‖²<sub>F</sub> / (‖XᵀX‖<sub>F</sub> ‖YᵀY‖<sub>F</sub>)</div>
        <p>The Frobenius norm is the square root of the sum of squared matrix entries. This normalized score lies between 0 and 1 when the denominator is nonzero. It is unchanged by rotations or uniform scaling, so it measures structural similarity rather than exact coordinates.</p>
      </details>
      <p className="tools-source">Further reading: <a href="https://proceedings.mlr.press/v97/kornblith19a.html" target="_blank" rel="noopener noreferrer">Kornblith et al. (2019), Similarity of Neural Network Representations Revisited</a>.</p>
    </article>
  </main>;
}
