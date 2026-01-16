-- Insert 40 universities from CSV demo data
-- This migration inserts demo university data into the university table

INSERT INTO "university" (
    "id",
    "name",
    "country",
    "description",
    "detail_information",
    "deadline",
    "requirements",
    "status",
    "rank",
    "url_link",
    "image_display_url",
    "created_at",
    "updated_at"
) VALUES
-- Top 10: REACH schools
(gen_random_uuid(), 'Harvard University', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 1, 'https://www.harvard.edu', 'https://www.harvard.edu/sites/default/files/content/Harvard_Shield_1x1_Red.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Stanford University', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 3 supplemental essays', 'ACTIVE', 2, 'https://www.stanford.edu', 'https://www.stanford.edu/wp-content/uploads/2017/06/stanford-seal.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Massachusetts Institute of Technology', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 3, 'https://www.mit.edu', 'https://www.mit.edu/wp-content/uploads/2020/08/mit-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Cambridge', 'United Kingdom', NULL, NULL, NULL, 'Personal statement (4000 characters), 1 academic essay', 'ACTIVE', 4, 'https://www.cam.ac.uk', 'https://www.cam.ac.uk/sites/www.cam.ac.uk/files/favicon.ico', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Oxford', 'United Kingdom', NULL, NULL, NULL, 'Personal statement (4000 characters), 1 academic essay', 'ACTIVE', 5, 'https://www.ox.ac.uk', 'https://www.ox.ac.uk/sites/files/oxford/media_wysiwyg/oxford_logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'California Institute of Technology', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 6, 'https://www.caltech.edu', 'https://www.caltech.edu/sites/default/files/caltech-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Princeton University', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 7, 'https://www.princeton.edu', 'https://www.princeton.edu/sites/default/files/princeton-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'National University of Singapore', 'Singapore', NULL, NULL, NULL, 'Personal statement (500 words), 2 supplemental essays', 'ACTIVE', 8, 'https://www.nus.edu.sg', 'https://www.nus.edu.sg/images/default-source/default-album/nus-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Yale University', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 9, 'https://www.yale.edu', 'https://www.yale.edu/sites/default/files/yale-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Columbia University', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 10, 'https://www.columbia.edu', 'https://www.columbia.edu/sites/default/files/columbia-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Rank 11-30: MATCH schools
(gen_random_uuid(), 'University of Chicago', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 11, 'https://www.uchicago.edu', 'https://www.uchicago.edu/sites/default/files/uchicago-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Imperial College London', 'United Kingdom', NULL, NULL, NULL, 'Personal statement (4000 characters), 1 academic essay', 'ACTIVE', 12, 'https://www.imperial.ac.uk', 'https://www.imperial.ac.uk/sites/default/files/imperial-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'ETH Zurich', 'Switzerland', NULL, NULL, NULL, 'Personal statement (500 words), 1 academic essay', 'ACTIVE', 13, 'https://www.ethz.ch', 'https://www.ethz.ch/sites/default/files/eth-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Tokyo', 'Japan', NULL, NULL, NULL, 'Personal statement (500 words), 2 supplemental essays', 'ACTIVE', 14, 'https://www.u-tokyo.ac.jp', 'https://www.u-tokyo.ac.jp/sites/default/files/utokyo-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Pennsylvania', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 15, 'https://www.upenn.edu', 'https://www.upenn.edu/sites/default/files/upenn-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Johns Hopkins University', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 16, 'https://www.jhu.edu', 'https://www.jhu.edu/sites/default/files/jhu-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Northwestern University', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 17, 'https://www.northwestern.edu', 'https://www.northwestern.edu/sites/default/files/nu-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Duke University', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 18, 'https://www.duke.edu', 'https://www.duke.edu/sites/default/files/duke-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Cornell University', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 19, 'https://www.cornell.edu', 'https://www.cornell.edu/sites/default/files/cornell-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Edinburgh', 'United Kingdom', NULL, NULL, NULL, 'Personal statement (4000 characters), 1 academic essay', 'ACTIVE', 20, 'https://www.ed.ac.uk', 'https://www.ed.ac.uk/sites/default/files/edinburgh-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Toronto', 'Canada', NULL, NULL, NULL, 'Personal statement (600 words), 1 supplemental essay', 'ACTIVE', 21, 'https://www.utoronto.ca', 'https://www.utoronto.ca/sites/default/files/uoft-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Carnegie Mellon University', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 22, 'https://www.cmu.edu', 'https://www.cmu.edu/sites/default/files/cmu-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'New York University', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 23, 'https://www.nyu.edu', 'https://www.nyu.edu/sites/default/files/nyu-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of British Columbia', 'Canada', NULL, NULL, NULL, 'Personal statement (600 words), 1 supplemental essay', 'ACTIVE', 24, 'https://www.ubc.ca', 'https://www.ubc.ca/sites/default/files/ubc-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Michigan', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 25, 'https://www.umich.edu', 'https://www.umich.edu/sites/default/files/umich-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Texas at Austin', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 26, 'https://www.utexas.edu', 'https://www.utexas.edu/sites/default/files/utexas-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of California Berkeley', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 4 supplemental essays', 'ACTIVE', 27, 'https://www.berkeley.edu', 'https://www.berkeley.edu/sites/default/files/berkeley-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Sydney', 'Australia', NULL, NULL, NULL, 'Personal statement (500 words), 1 supplemental essay', 'ACTIVE', 28, 'https://www.sydney.edu.au', 'https://www.sydney.edu.au/sites/default/files/sydney-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of California Los Angeles', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 4 supplemental essays', 'ACTIVE', 29, 'https://www.ucla.edu', 'https://www.ucla.edu/sites/default/files/ucla-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Melbourne', 'Australia', NULL, NULL, NULL, 'Personal statement (500 words), 1 supplemental essay', 'ACTIVE', 33, 'https://www.unimelb.edu.au', 'https://www.unimelb.edu.au/__data/assets/image/0004/3152409/unimelb-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Rank 31+: SAFETY schools
(gen_random_uuid(), 'University of Illinois Urbana-Champaign', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 34, 'https://www.illinois.edu', 'https://www.illinois.edu/sites/default/files/illinois-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Wisconsin-Madison', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 2 supplemental essays', 'ACTIVE', 35, 'https://www.wisc.edu', 'https://www.wisc.edu/sites/default/files/wisc-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Georgia Institute of Technology', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 1 supplemental essay', 'ACTIVE', 38, 'https://www.gatech.edu', 'https://www.gatech.edu/sites/default/files/gatech-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Queensland', 'Australia', NULL, NULL, NULL, 'Personal statement (500 words), 1 supplemental essay', 'ACTIVE', 42, 'https://www.uq.edu.au', 'https://www.uq.edu.au/sites/default/files/uq-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Monash University', 'Australia', NULL, NULL, NULL, 'Personal statement (500 words), 1 supplemental essay', 'ACTIVE', 45, 'https://www.monash.edu', 'https://www.monash.edu/sites/default/files/monash-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Washington', 'United States', NULL, NULL, NULL, 'Personal statement (650 words), 1 supplemental essay', 'ACTIVE', 55, 'https://www.washington.edu', 'https://www.washington.edu/sites/default/files/uw-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Auckland', 'New Zealand', NULL, NULL, NULL, 'Personal statement (500 words), 1 supplemental essay', 'ACTIVE', 68, 'https://www.auckland.ac.nz', 'https://www.auckland.ac.nz/sites/default/files/auckland-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Adelaide', 'Australia', NULL, NULL, NULL, 'Personal statement (500 words), 1 supplemental essay', 'ACTIVE', 72, 'https://www.adelaide.edu.au', 'https://www.adelaide.edu.au/sites/default/files/adelaide-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Otago', 'New Zealand', NULL, NULL, NULL, 'Personal statement (500 words), 1 supplemental essay', 'ACTIVE', 85, 'https://www.otago.ac.nz', 'https://www.otago.ac.nz/sites/default/files/otago-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'University of Waikato', 'New Zealand', NULL, NULL, NULL, 'Personal statement (500 words), 1 supplemental essay', 'ACTIVE', 125, 'https://www.waikato.ac.nz', 'https://www.waikato.ac.nz/sites/default/files/waikato-logo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
