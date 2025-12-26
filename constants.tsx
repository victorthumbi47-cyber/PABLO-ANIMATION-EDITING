
import React from 'react';
import { StyleOption, Project } from './types';

export const STYLES: StyleOption[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic neon aesthetics',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWzJbGstEfQ5FRaOZNb65coRhdthsGYheEaSTdVUiQqbANpKV-dcnIbFWthBXS7LMmJK_zQhhvi0YuSmkFbTS0rE8XoVxD-K0mhSOwSNkjsbFTzTfXSK7xbi6eUsr57zg0nFxGTiiV6I3UYlp1OolNALY6-fUknyHvs7AK_ks0YFgmrap8YnFkgMos-qdCbyHi5qKwbyqknbKMIqrx3Mg2i7swNuKfL2H03mxCs6RC0IVhRgCQdLDv5JzyVdZchTG6bk2yAuQAk-SS'
  },
  {
    id: 'oil-painting',
    name: 'Oil Painting',
    description: 'Rich textured art',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJr-kjWPEO6nj0yUzTNGGcJ6Plg-1rD6J7-pmsLo2tKt9TXnck5IWZ-lO-u_-ieD-0laOEt_LlUePdeynCWCl6xhNnUyqMxZUTfWdzvuyLA6nNoHakf53yeRqYEVCX_Q6wTtefwnvruujNk5NZvZtrpldnl9Nwv4GItpOLdPud04q0DirA4IHfqri7R1AntemFbT1xzVnkj7ohvTinW5MDGTQErCOufoNJfnCmG5VQU6tMnVDhQURBNoSDEUIKCuEb-yGPzlgUX8_4'
  },
  {
    id: 'anime',
    name: 'Classic Anime',
    description: '2D Japanese animation',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrHj_3qRjccJwilfK97zQHgd15EfazNoY0DvAiLqiFGyM2kYYQ_Luwflf-iYzWPfL_XCceC9SzcLSMaW52OBevRfYhWwYElbgcj6C8fnEGrbrzfpff0UKvYPxMA-5sJQ3K_xgU0jm43zdRJx5Kgqf7tnGYfsE17rFIFWMIZtmtOxs4L13BAChE6gZM3moiVRSPjE3cNMgdBO5X5sGwk0nanRyJbcjI_rZ5fU0OpHpfh4_L4KA1GS5JBef31gu78MPK5-kfWKAXIQ3r'
  },
  {
    id: 'claymation',
    name: 'Claymation',
    description: 'Stop motion look',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIWyAQTe2PT-Cfcd6utIUaiw6XcM_4QqIQB1xKFJSVKNXQ06eWVqWLuf0seVRV5U88XH4-FvoKYLG8OktWsaOrx2x_JG7LDntAuNtqaI_Clmpylv7jTXzXCZeJP0fP3O28K7oSN_NcMUPqoUUFn16q_CmINTctcRmeP7o9La5YN7jQ40-1IhFw-RoJ2X1hLUxgoysT3KTcq2MSVITRnwZ9kmJKb_5x2hC617amjNiXAb41Pm0DDFLN0fgwNKAhHg3MvikXe-5GX_7O'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Dance Challenge V2',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4waIeheaWIkTtxzR55Q9IyXxYm9xND-8bo61P37ORlCgCmvsl2CJziRYDl9XRy5k1xGIMFtPNXdmUDDQwD-MsoDWASnJ8HKhk67pjLR_mp8VH-iZUyyM93kh_NQ69T1Bquw5hnc0FotQvwLxbLcjmLX0Np-zWkra86pp1nuQQETI7sx28GD9JZYtQkdfkRAP99DWRitgLsQposcaK5ugImSuzLIVNhdtZozCfzW6uXbGp4Y2dnaUbhn0qHYCTuGUX7-V5jD-Xs8nR',
    duration: '02:14',
    status: 'Rendered',
    style: 'Anime Style',
    date: '2 hours ago'
  },
  {
    id: '2',
    name: 'Interview Clip - John',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACndSeJaewu-Mfj8SsDpEPTBiO7xXd0c-j8OQit8hRF8z3J-z1GcN4vkVWTKCETT9ghDXCzvOK6wWhAplbUnCfxMi3XzZScZxYrTcM5GoooCyZCr4RazIJo2_xn-fSQUR0PsdySWOjA4JLJCVRl92JqoiGY4fnRRnDo3gXoPUmWRcEbE9jgRO3eanAwaHRGlVCnFcTdrzOU9Yrl3egERO1ilpRvxEHy2rPf7DLi1eMgi8nJ0xgNJFvyQnfO-r5MRuRGcZhnQcbmzbk',
    duration: '00:45',
    status: 'Draft',
    style: 'Toon Shader',
    date: 'Yesterday'
  },
  {
    id: '3',
    name: 'Mountain Hiking Vlog',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfzpAMtKx_F3WQeiQCgYNtGHQ4TyiECCSU_mbqgFZcTbUj79F9Upnj5abwf8l6bJQRh1l7t6Xmzp1JpaZSjmm9dbHA_B0nmAGVa7IhPZTjAehjz2OMQ5vvnd9yMcJaYgyX_A1HkG5eOGCLElXbvbso6rhzaho7Du0HkuFZh_HBGr-L84tvi9gUS6hC0mhgt-Ov5Yu2CqnlL3zKN-ox8RFalkmmVezSAYs7rzqRHIpZ-CKYcqPWVNPVLNt3dyMwKBnrS8XRb5_igepE',
    duration: '10:02',
    status: 'Processing',
    style: 'Oil Paint',
    date: '3 days ago'
  }
];
