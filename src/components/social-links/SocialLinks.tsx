import Image from 'next/legacy/image';
import Link from 'next/link';
import React from 'react';
import socialMediaImages from '../../../public/data/social-media-images.json';
import styles from './SocialLinks.module.scss';

function SocialLinks() {

    return <div data-testid="social-links" className={styles.socialLinks}>
        {socialMediaImages['social-media-links'].map((el) => (
            <div key={el.name}>
                <Link href="/" target="blank">
                    <Image width={80} height={80} src={el.url} alt={el.name} />
                </Link>
            </div>
        ))}
    </div>;
}

export default SocialLinks;
