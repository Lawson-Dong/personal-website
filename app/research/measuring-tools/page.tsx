import { MathTex } from '@/components/math';
import Link from 'next/link';
import './measuring-tools.css';

export const metadata = {
  title: 'The measuring tools — Lawson Dong',
  description: 'Short introductions to Adjacent Linear CKA and raw-vector Fisher ratio for measuring representation similarity and class separation.',
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
        <div className="tools-formula"><MathTex display tex={String.raw`\operatorname{CKA}(X,Y)=\frac{\|X^\top Y\|_F^2}{\|X^\top X\|_F\,\|Y^\top Y\|_F}`} /></div>
        <p>The Frobenius norm is the square root of the sum of squared matrix entries. This normalized score lies between 0 and 1 when the denominator is nonzero. It is unchanged by rotations or uniform scaling, so it measures structural similarity rather than exact coordinates.</p>
      </details>
      <p className="tools-source">Further reading: <a href="https://proceedings.mlr.press/v97/kornblith19a.html" target="_blank" rel="noopener noreferrer">Kornblith et al. (2019), Similarity of Neural Network Representations Revisited</a>.</p>
    </article>
    <article id="fisher-ratio" aria-labelledby="fisher-title">
      <p className="eyebrow">02 / CLASS SEPARATION</p>
      <h2 id="fisher-title">Raw-vector Fisher ratio</h2>
      <p><strong>How far apart are the class centers compared with the spread inside each class?</strong></p>
      <p>In our cat–dog experiments, this ratio compares the squared distance between the two class centroids with the sum of their within-class spreads. A centroid is simply the average representation vector for a class.</p>
      <p>“Raw-vector” means we use the extracted feature vectors before normalizing each sample to unit length. Both vector direction and magnitude can therefore contribute.</p>
      <h3>Why use raw vectors?</h3>
      <p>We want to measure class separation in the features the network actually produces, including differences in vector length. Normalizing every sample to unit length removes those magnitude differences and changes the class centroids and within-class spread.</p>
      <p>For example, two vectors pointing in the same direction but having different lengths become identical after unit normalization. If their lengths help distinguish the classes, that information is lost. Raw-vector Fisher ratio preserves it and complements our cosine-based measurements, which focus on direction.</p>
      <p>This does not make raw vectors universally better: the choice depends on the question. A common rescaling of all vectors cancels in the ratio, while differences in scale between samples or features can still affect it.</p>
      <div className="tools-reading">
        <div><h3>Higher ratio</h3><p>The class centers are farther apart relative to the spread within each class.</p></div>
        <div><h3>Lower ratio</h3><p>The class centers are closer together relative to the spread within each class.</p></div>
      </div>
      <p>Tracking this ratio across layers shows how class separation changes. An increase can reflect centers moving apart, tighter clusters, or both; it does not by itself guarantee better classification accuracy. Unlike CKA, the ratio is not bounded by 1.</p>
      <details><summary>The formula, briefly</summary>
        <div className="tools-formula"><MathTex display tex={String.raw`\mu_C=\frac{1}{N_C}\sum_{i\in C}z_i,\qquad \mu_D=\frac{1}{N_D}\sum_{i\in D}z_i`} /></div>
        <p>Here C and D are the cat and dog sample sets, N is the number of samples in each class, and each z is a raw representation vector.</p>
        <div className="tools-formula"><MathTex display tex={String.raw`F=\frac{\|\mu_C-\mu_D\|_2^2}{\frac{1}{N_C}\sum_{i\in C}\|z_i-\mu_C\|_2^2+\frac{1}{N_D}\sum_{i\in D}\|z_i-\mu_D\|_2^2}`} /></div>
        <MathTex display tex={String.raw`F=\frac{\text{between-class separation}}{\text{within-class dispersion}}`} />
        <p>The implementation floors the denominator at <MathTex tex={String.raw`10^{-20}`} /> to avoid division by zero.</p>
        <p>For a nonzero denominator above that numerical floor, multiplying all vectors by the same nonzero scalar leaves the ratio unchanged. Scaling individual features differently can change it.</p>
      </details>
      <p>CKA compares representation structure between layers; the Fisher ratio measures label-based class separation within a layer.</p>
      <p className="tools-source">Implementation: <a href="https://github.com/Lawson-Dong/representation-alignment-/blob/representation-vector-geometric-dynamics/experiments/geometric_dynamics/scripts/metrics.py" target="_blank" rel="noopener noreferrer">Fisher_raw in the experiment metrics</a>.</p>
    </article>
  </main>;
}
