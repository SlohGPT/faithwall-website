import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BlogPostContent from '../components/BlogPostContent';
import NotFound from './NotFound';
import { getPost, getListing, getRelated } from '../lib/posts';

export default function BlogPost() {
  const { slug = '' } = useParams<{ slug: string }>();
  const post = getPost(slug);
  const listing = getListing(slug);

  if (!post || !listing) return <NotFound />;

  const related = getRelated(slug, post.meta.cluster);
  const url = `https://faithwall.app/blog/${slug}`;
  const imageUrl = post.meta.image.startsWith('http')
    ? post.meta.image
    : `https://faithwall.app${post.meta.image}`;
  const dateModified = post.meta.dateModified || post.meta.datePublished;
  // Google appends the site name itself when the document title is long;
  // keep the post title as-is to avoid SERP truncation when titles run past ~55 chars.
  const docTitle =
    post.meta.title.length > 55 ? post.meta.title : `${post.meta.title} | FaithWall`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.meta.title,
    description: post.meta.description,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 675,
    },
    datePublished: post.meta.datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: 'Karol Billik',
      url: 'https://faithwall.app/about/karol-billik',
      jobTitle: 'Founder',
      worksFor: { '@type': 'Organization', name: 'FaithWall' },
    },
    publisher: {
      '@type': 'Organization',
      name: 'FaithWall',
      logo: {
        '@type': 'ImageObject',
        url: 'https://faithwall.app/icon-app-512.png',
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.meta.keywords.join(', '),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://faithwall.app/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://faithwall.app/blog' },
      { '@type': 'ListItem', position: 3, name: post.meta.title, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-surface">
      <Helmet>
        <title>{docTitle}</title>
        <meta name="description" content={post.meta.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={post.meta.title} />
        <meta property="og:description" content={post.meta.description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="675" />
        <meta name="twitter:title" content={post.meta.title} />
        <meta name="twitter:description" content={post.meta.description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta property="article:published_time" content={post.meta.datePublished} />
        <meta property="article:modified_time" content={dateModified} />
        <meta property="article:author" content="Karol Billik" />
        {post.meta.keywords.map((k) => (
          <meta key={k} property="article:tag" content={k} />
        ))}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <Navigation />
      <BlogPostContent post={post} slug={slug} related={related} />
      <Footer />
    </div>
  );
}
